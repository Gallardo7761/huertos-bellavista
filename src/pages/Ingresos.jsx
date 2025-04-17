import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import { usePaginatedList } from '../hooks/usePaginatedList';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import PDFModal from '../components/PDFModal';

import IngresoCard from '../components/Ingresos/IngresoCard';
import IngresosFilter from '../components/Ingresos/IngresosFilter';
import { IngresosPDF } from '../components/Ingresos/IngresosPDF';
import { CONSTANTS } from '../util/constants';

import '../css/Ingresos.css';

const PAGE_SIZE = 10;

const Ingresos = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.incomes.allWithNames,
    rawUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.incomes.all,
    params: {
      _sort: 'created_at',
      _order: 'desc'
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <IngresosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const IngresosContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useDataContext();
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingIngreso, setCreatingIngreso] = useState(false);
  const [tempIngreso, setTempIngreso] = useState(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    initialFilters: {
      todos: true,
      banco: true,
      caja: true,
      semestral: true,
      anual: true
    },
    filterFn: (ingreso, filters) => {
      if (filters.todos) return true;

      const { banco, caja, semestral, anual } = filters;

      const typeMatch =
        (banco && ingreso.type === CONSTANTS.PAYMENT_TYPE_BANK) ||
        (caja && ingreso.type === CONSTANTS.PAYMENT_TYPE_CASH);

      const freqMatch =
        (semestral && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY) ||
        (anual && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_YEARLY);

      const typeFilters = [banco, caja].filter(Boolean).length;
      const freqFilters = [semestral, anual].filter(Boolean).length;

      if (typeFilters > 0 && freqFilters > 0) return typeMatch && freqMatch;
      if (typeFilters > 0 && freqFilters === 0) return typeMatch;
      if (freqFilters > 0 && typeFilters === 0) return freqMatch;

      return false;
    },
    searchFn: (ingreso, term) => {
      const normalized = term.toLowerCase();
      return (
        ingreso.concept?.toLowerCase().includes(normalized) ||
        String(ingreso.member_number).includes(normalized)
      );
    }
  });

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingIngreso(true);
    setTempIngreso({
      income_id: null,
      member_number: 0,
      concept: '',
      amount: 0.0,
      frequency: CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
      type: CONSTANTS.PAYMENT_TYPE_BANK
    });
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(reqConfig.rawUrl, nuevo);
      setCreatingIngreso(false);
      setTempIngreso(null);
    } catch (err) {
      console.error("Error creando ingreso:", err);
    }
  };

  const handleEditSubmit = async (editado) => {
    try {
      await putData(`${reqConfig.rawUrl}/${editado.income_id}`, editado);
    } catch (err) {
      console.error("Error actualizando ingreso:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar el ingreso?")) return;
    try {
      await deleteData(`${reqConfig.rawUrl}/${id}`);
      setSearchTerm("");
    } catch (err) {
      console.error("Error eliminando ingreso:", err);
    }
  };

  const handleCancelCreate = () => {
    setCreatingIngreso(false);
    setTempIngreso(null);
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className="section-title">Lista de Ingresos</h1>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtersComponent={<IngresosFilter filters={filters} onChange={setFilters} />}
          onCreate={handleCreate}
          onPDF={() => setShowPDFModal(true)}
        />

        <PaginatedCardGrid
          items={filtered}
          creatingItem={creatingIngreso}
          renderCreatingCard={() => (
            <IngresoCard
              income={tempIngreso}
              isNew
              onCreate={handleCreateSubmit}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
          renderCard={(income) => (
            <IngresoCard
              key={income.income_id}
              income={income}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
        />

        <PDFModal show={showPDFModal} onClose={() => setShowPDFModal(false)} title="Vista previa del PDF">
          <IngresosPDF ingresos={filtered} />
        </PDFModal>
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Ingresos;

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
import GastoCard from '../components/Gastos/GastoCard';
import GastosFilter from '../components/Gastos/GastosFilter';
import { GastosPDF } from '../components/Gastos/GastosPDF';

import '../css/Ingresos.css';
import { CONSTANTS } from '../util/constants';

const PAGE_SIZE = 10;

const Gastos = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.expenses.all}`,
    params: {
      _sort: 'created_at',
      _order: 'desc',
    },
  };

  return (
    <DataProvider config={reqConfig}>
      <GastosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const GastosContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useDataContext();
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingGasto, setCreatingGasto] = useState(false);
  const [tempGasto, setTempGasto] = useState(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    initialFilters: {
      todos: true,
      banco: true,
      caja: true
    },
    filterFn: (gasto, filters) => {
      if (filters.todos) return true;
      return (
        (filters.banco && gasto.type === CONSTANTS.PAYMENT_TYPE_BANK) ||
        (filters.caja && gasto.type === CONSTANTS.PAYMENT_TYPE_CASH)
      );
    },
    searchFn: (gasto, term) => {
      const normalized = term.toLowerCase();
      return (
        gasto.concept?.toLowerCase().includes(normalized) ||
        gasto.supplier?.toLowerCase().includes(normalized) ||
        gasto.invoice?.toLowerCase().includes(normalized)
      );
    }
  });

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingGasto(true);
    setTempGasto({
      expense_id: null,
      concept: '',
      amount: 0.0,
      supplier: '',
      invoice: '',
      type: 0
    });
    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(reqConfig.baseUrl, nuevo);
      setCreatingGasto(false);
      setTempGasto(null);
    } catch (err) {
      console.error("Error creando gasto:", err.message);
    }
  };

  const handleEditSubmit = async (editado) => {
    try {
      await putData(`${reqConfig.baseUrl}/${editado.expense_id}`, editado);
    } catch (err) {
      console.error("Error actualizando gasto:", err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este gasto?");
    if (!confirmed) return;

    try {
      await deleteData(`${reqConfig.baseUrl}/${id}`);
      setSearchTerm("");
    } catch (err) {
      console.error("Error eliminando gasto:", err.message);
    }
  };

  const handleCancelCreate = () => {
    setCreatingGasto(false);
    setTempGasto(null);
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className="section-title">Lista de Gastos</h1>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtersComponent={<GastosFilter filters={filters} onChange={setFilters} />}
          onCreate={handleCreate}
          onPDF={() => setShowPDFModal(true)}
        />

        <PaginatedCardGrid
          items={filtered}
          creatingItem={creatingGasto}
          renderCreatingCard={() => (
            <GastoCard
              gasto={tempGasto}
              isNew
              onCreate={handleCreateSubmit}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
          renderCard={(gasto) => (
            <GastoCard
              key={gasto.expense_id}
              gasto={gasto}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
        />

        <PDFModal show={showPDFModal} onClose={() => setShowPDFModal(false)} title="Vista previa del PDF">
          <GastosPDF gastos={filtered} />
        </PDFModal>
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Gastos;

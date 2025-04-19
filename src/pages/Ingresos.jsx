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
import { errorParser } from '../util/parsers/errorParser';

import '../css/Ingresos.css';
import CustomModal from '../components/CustomModal';
import { Button } from 'react-bootstrap';

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
  const [error, setError] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
      const typeMatch = (banco && ingreso.type === CONSTANTS.PAYMENT_TYPE_BANK) || (caja && ingreso.type === CONSTANTS.PAYMENT_TYPE_CASH);
      const freqMatch = (semestral && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY) || (anual && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_YEARLY);
      const typeFilters = [banco, caja].filter(Boolean).length;
      const freqFilters = [semestral, anual].filter(Boolean).length;
      if (typeFilters > 0 && freqFilters > 0) return typeMatch && freqMatch;
      if (typeFilters > 0) return typeMatch;
      if (freqFilters > 0) return freqMatch;
      return false;
    },
    searchFn: (ingreso, term) => {
      const normalized = term.toLowerCase();
      return ingreso.concept?.toLowerCase().includes(normalized) || String(ingreso.member_number).includes(normalized);
    }
  });

  const handleCreate = () => {
    setCreatingIngreso(true);
    setTempIngreso({
      income_id: null,
      member_number: 0,
      concept: '',
      amount: 0.0,
      frequency: CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
      type: CONSTANTS.PAYMENT_TYPE_BANK
    });
    document.querySelector('.cards-grid')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingIngreso(false);
    setTempIngreso(null);
    setError(null);
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(reqConfig.rawUrl, nuevo);
      setError(null);
      setCreatingIngreso(false);
      setTempIngreso(null);
    } catch (err) {
      setTempIngreso({ ...nuevo });
      setError(errorParser(err));
    }
  };

  const handleEditSubmit = async (editado, id) => {
    try {
      await putData(`${reqConfig.rawUrl}/${id}`, editado);
      setError(null);
    } catch (err) {
      setError(errorParser(err));
    }
  };


  const handleDelete = async (id) => {
    setDeleteTargetId(id);
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
              onCancel={handleCancelCreate}
              error={error}
              onClearError={() => setError(null)}
              allIncomes={data}
            />
          )}
          renderCard={(income) => (
            <IngresoCard
              key={income.income_id}
              income={income}
              onUpdate={(data, id) => handleEditSubmit(data, id)}
              onDelete={() => handleDelete(income.income_id)}
              error={error}
              onClearError={() => setError(null)}
              allIncomes={data}
            />
          )}
        />

        <PDFModal show={showPDFModal} onClose={() => setShowPDFModal(false)} title="Vista previa del PDF">
          <IngresosPDF ingresos={filtered} />
        </PDFModal>

        <CustomModal
          title="Confirmar eliminación"
          show={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
        >
          <p className='p-3'>¿Estás seguro de que quieres eliminar el ingreso?</p>
          <div className="d-flex justify-content-end gap-2 mt-3 p-3">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await deleteData(`${reqConfig.rawUrl}/${deleteTargetId}`);
                  setSearchTerm("");
                  setDeleteTargetId(null);
                } catch (err) {
                  setError(errorParser(err));
                }
              }}
            >
              Confirmar
            </Button>
          </div>
        </CustomModal>

      </ContentWrapper>
    </CustomContainer>
  );
};

export default Ingresos;
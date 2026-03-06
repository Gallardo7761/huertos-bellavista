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
import CustomModal from '../components/CustomModal';
import { Button } from 'react-bootstrap';
import { useError } from '../context/ErrorContext';

const PAGE_SIZE = 10;

const Gastos = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.expenses.all}`,
    params: {},
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <GastosContent reqConfig={reqConfig}/>
    </DataProvider>
  );
};

const GastosContent = ({ reqConfig }) => {
  const { data, dataLoading, postData, putData, deleteData } = useDataContext();
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingGasto, setCreatingGasto] = useState(false);
  const [tempGasto, setTempGasto] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);

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
    setCreatingGasto(true);
    setTempGasto({
      expenseId: null,
      concept: '',
      amount: 0.0,
      supplier: '',
      invoice: '',
      type: 0
    });
    document.querySelector('.cards-grid')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(reqConfig.baseUrl, nuevo);
      setCreatingGasto(false);
      setTempGasto(null);
      setFieldErrors(null);
    } catch (err) {
      setTempGasto({ ...nuevo });
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const handleEditSubmit = async (editado, id) => {
    try {
      await putData(`${reqConfig.baseUrl}/${id}`, editado);
    } catch (err) {
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    setDeleteTargetId(id);
  };

  const handleCancelCreate = () => {
    setCreatingGasto(false);
    setTempGasto(null);
    setFieldErrors(null);
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

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
              onCancel={handleCancelCreate}
              fieldErrors={fieldErrors}
            />
          )}
          renderCard={(gasto) => (
            <GastoCard
              key={gasto.expenseId}
              gasto={gasto}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              fieldErrors={fieldErrors}
            />
          )}
        />

        <PDFModal show={showPDFModal} onClose={() => setShowPDFModal(false)} title="Vista previa del PDF">
          <GastosPDF gastos={filtered} />
        </PDFModal>

        <CustomModal
          title="Confirmar eliminación"
          show={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
        >
          <p className='p-3'>¿Estás seguro de que quieres eliminar el gasto?</p>
          <div className="d-flex justify-content-end gap-2 mt-3 p-3">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await deleteData(`${reqConfig.baseUrl}/${deleteTargetId}`);
                  setSearchTerm("");
                  setDeleteTargetId(null);
                } catch (err) {
                  console.error(err);
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

export default Gastos;

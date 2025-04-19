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
import { errorParser } from '../util/parsers/errorParser';

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
  const [error, setError] = useState(null);

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
      expense_id: null,
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
      setError(null);
      setCreatingGasto(false);
      setTempGasto(null);
    } catch (err) {
      setTempGasto({ ...nuevo });
      setError(errorParser(err));
    }
  };

  const handleEditSubmit = async (editado, id) => {
    try {
      await putData(`${reqConfig.baseUrl}/${id}`, editado);
      setError(null);
    } catch (err) {
      setError(errorParser(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar el gasto?")) return;
    try {
      await deleteData(`${reqConfig.baseUrl}/${id}`);
      setSearchTerm("");
    } catch (err) {
      setError(errorParser(err));
    }
  };

  const handleCancelCreate = () => {
    setCreatingGasto(false);
    setTempGasto(null);
    setError(null);
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
              onCancel={handleCancelCreate}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
          renderCard={(gasto) => (
            <GastoCard
              key={gasto.expense_id}
              gasto={gasto}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              error={error}
              onClearError={() => setError(null)}
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

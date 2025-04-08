import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { DataProvider } from '../context/DataContext';

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

  const HOST = config.apiConfig.baseUrl;
  const BASE = `${HOST}`;
  const ENDPOINT = config.apiConfig.endpoints.expenses.all;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {
      _sort: 'created_at',
      _order: 'desc'
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <GastosContent config={reqConfig} />
    </DataProvider>
  );
};

const GastosContent = ({ config }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useData();
  const [showPDFModal, setShowPDFModal] = useState(false);

  const {
    paginated,
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loaderRef,
    loading,
    isUsingFilters,
    creatingItem: creatingGasto,
    setCreatingItem: setCreatingGasto,
    tempItem: tempGasto,
    setTempItem: setTempGasto
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

      const { banco, caja } = filters;

      return (
        (banco && gasto.type === CONSTANTS.PAYMENT_TYPE_BANK) ||
        (caja && gasto.type === CONSTANTS.PAYMENT_TYPE_CASH)
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

  const showPDFPopup = () => setShowPDFModal(true);
  const closePDFPopup = () => setShowPDFModal(false);

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingGasto(true);
    setTempGasto({
      expense_id: null,
      concept: '',
      amount: 0.0,
      supplier: '',
      invoice: '',
      type: 0,
      created_at: new Date().toISOString()
    });
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateSubmit = async (newGasto) => {
    try {
      const res = await postData(config.baseUrl, newGasto);
      console.log("Gasto creado:", res);
      setCreatingGasto(false);
      setTempGasto(null);
    } catch (err) {
      console.error("Error creando gasto:", err);
    }
  };

  const handleEditSubmit = async (updatedGasto) => {
    try {
      const res = await putData(`${config.baseUrl}/${updatedGasto.expense_id}`, updatedGasto);
      console.log("Gasto actualizado:", res);
    } catch (err) {
      console.error("Error actualizando gasto:", err);
    }
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el gasto con ID ${expenseId}?`);
    if (!confirmed) return;

    try {
      await deleteData(`${config.baseUrl}/${expenseId}`);
      console.log("Gasto eliminado correctamente");
      setSearchTerm("");
    } catch (err) {
      console.error("Error eliminando gasto:", err);
    }
  };

  const handleCancelCreate = () => {
    setCreatingGasto(false);
    setTempGasto(null);
  };

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
          onPDF={showPDFPopup}
        />

        <PaginatedCardGrid
          items={isUsingFilters ? filtered : paginated}
          loaderRef={loaderRef}
          loading={loading}
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
      </ContentWrapper>

      <PDFModal show={showPDFModal} onClose={closePDFPopup} title="Vista previa del PDF">
        <GastosPDF gastos={filtered} />
      </PDFModal>
    </CustomContainer>
  );
};

export default Gastos;

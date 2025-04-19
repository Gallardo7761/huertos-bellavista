import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import { usePaginatedList } from '../hooks/usePaginatedList';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PDFModal from '../components/PDFModal';
import SociosFilter from '../components/Socios/SociosFilter';
import SocioCard from '../components/Socios/SocioCard';
import { SociosPDF } from '../components/Socios/SociosPDF';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import CustomModal from '../components/CustomModal';
import IngresoCard from '../components/Ingresos/IngresoCard';
import { errorParser } from '../util/parsers/errorParser';

import '../css/Socios.css';
import { Button } from 'react-bootstrap';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.members.all}`,
    incomesUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.members.payments}`,
    rawIncomesUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.incomes.all}`,
    params: {
      _sort: "member_number",
      _order: "asc"
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <SociosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const SociosContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, getData, postData, putData, deleteData } = useDataContext();

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingSocio, setCreatingSocio] = useState(false);
  const [tempSocio, setTempSocio] = useState(null);
  const [showIncomesModal, setShowIncomesModal] = useState(false);
  const [selectedMemberNumber, setSelectedMemberNumber] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [incomesLoading, setIncomesLoading] = useState(false);
  const [incomesError, setIncomesError] = useState(null);
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
    filterFn: (socio, filters) => {
      if (filters.todos) return true;
      return (
        (filters.listaEspera && socio.type === 0) ||
        (filters.hortelanos && socio.type === 1) ||
        (filters.invernadero && socio.type === 2) ||
        (filters.colaboradores && socio.type === 3) ||
        (filters.inactivos && socio.status === 0)
      );
    },
    searchFn: (socio, term) => {
      const normalized = term.toLowerCase();
      return (
        socio.display_name?.toLowerCase().includes(normalized) ||
        socio.dni?.toLowerCase().includes(normalized) ||
        String(socio.member_number).includes(normalized) ||
        String(socio.plot_number).includes(normalized)
      );
    },
    initialFilters: {
      todos: true,
      listaEspera: true,
      invernadero: true,
      inactivos: true,
      colaboradores: true,
      hortelanos: true
    }
  });

  const handleCreate = () => {
    setCreatingSocio(true);
    const socio = {
      user_id: null,
      user_name: "nuevo" + Date.now(),
      email: "",
      display_name: "Nuevo Socio",
      role: 0,
      global_status: 1,
      member_number: "",
      plot_number: "",
      dni: "",
      phone: "",
      notes: "",
      status: 1,
      type: 1
    };
    setTempSocio(socio);
    document.querySelector('.cards-grid').scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingSocio(false);
    setTempSocio(null);
    setError(null);
  };

  const handleCreateSubmit = async (newSocio) => {
    try {
      newSocio.user_name = newSocio.display_name.split(" ")[0].toLowerCase() + newSocio.member_number;
      await postData(reqConfig.baseUrl, newSocio);
      setError(null);
      setCreatingSocio(false);
      setTempSocio(null);
    } catch (err) {
      setTempSocio({ ...newSocio });
      setError(errorParser(err));
    }
  };

  const handleEditSubmit = async (updatedSocio, userId) => {
    try {
      await putData(`${reqConfig.baseUrl}/${userId}`, updatedSocio);
      setError(null);
    } catch (err) {
      setError(errorParser(err));
    }
  };

  const handleDelete = async (userId) => {
    setDeleteTargetId(userId);
  };

  const handleViewIncomes = async (memberNumber) => {
    setSelectedMemberNumber(memberNumber);
    setShowIncomesModal(true);
    setIncomes([]);
    setIncomesLoading(true);
    setIncomesError(null);

    try {
      const url = reqConfig.incomesUrl.replace(":member_number", memberNumber);
      const res = await getData(url);
      setIncomes(res.data);
    } catch (err) {
      setIncomesError(err.message);
    } finally {
      setIncomesLoading(false);
    }
  };

  const handleIncomeUpdate = async (editado) => {
    try {
      await putData(`${reqConfig.rawIncomesUrl}/${editado.income_id}`, editado);
      await handleViewIncomes(selectedMemberNumber);
    } catch (err) {
      console.error("Error actualizando ingreso:", err);
    }
  };

  const showPDFPopup = () => setShowPDFModal(true);
  const closePDFPopup = () => setShowPDFModal(false);

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className='section-title'>Lista de Socios</h1>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtersComponent={<SociosFilter filters={filters} onChange={setFilters} />}
          onCreate={handleCreate}
          onPDF={showPDFPopup}
        />

        <PaginatedCardGrid
          items={filtered}
          creatingItem={creatingSocio}
          renderCreatingCard={() => (
            <SocioCard
              socio={tempSocio}
              isNew
              onCreate={handleCreateSubmit}
              onCancel={handleCancelCreate}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
          renderCard={(socio) => (
            <SocioCard
              key={socio.user_id}
              socio={socio}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
              onViewIncomes={() => handleViewIncomes(socio.member_number)}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
        />
      </ContentWrapper>

      <PDFModal show={showPDFModal} onClose={closePDFPopup} title="Vista previa del PDF">
        <SociosPDF socios={filtered} />
      </PDFModal>

      <CustomModal
        show={showIncomesModal}
        onClose={() => setShowIncomesModal(false)}
        title={`Ingresos del socio nº ${selectedMemberNumber}`}
      >
        {incomesLoading && <p className="text-center my-3"><LoadingIcon /></p>}
        {incomesError && <p className="text-danger text-center my-3">{incomesError}</p>}
        {!incomesLoading && !incomesError && incomes.length === 0 && (
          <p className="text-center my-3">Este socio no tiene ingresos registrados.</p>
        )}
        <div className="d-flex flex-wrap gap-3 p-3 justify-content-start">
          {incomes.map((income) => (
            <IngresoCard key={income.income_id} income={income}
              onUpdate={handleIncomeUpdate} className='from-members' />
          ))}
        </div>
      </CustomModal>

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
                await deleteData(`${reqConfig.baseUrl}/${deleteTargetId}`);
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

    </CustomContainer>
  );
};

export default Socios;

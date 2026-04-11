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

import '../css/Socios.css';
import { Button } from 'react-bootstrap';
import { useError } from '../context/ErrorContext';
import { faAt, faFilePdf, faFilter } from '@fortawesome/free-solid-svg-icons';
import AnimatedDropdown from '../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SociosExportarCorreo from '../components/Socios/SociosExportarCorreo';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.users.all}`,
    incomesUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.users.incomesPreview}`,
    rawIncomesUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.incomes.all}`,
    params: {}
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <SociosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const SociosContent = ({ reqConfig }) => {
  const { data, dataLoading, getData, postData, putData, deleteData } = useDataContext();

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingSocio, setCreatingSocio] = useState(false);
  const [tempSocio, setTempSocio] = useState(null);
  const [showIncomesModal, setShowIncomesModal] = useState(false);
  const [selectedMemberNumber, setSelectedMemberNumber] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [incomesLoading, setIncomesLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [incomeFieldErrors, setIncomeFieldErrors] = useState(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    filterFn: (identity, filters) => {
      if (filters.todos) return true;
      if (!filters.inactivos && identity.account.status === 0) return false;
      return (
        (filters.listaEspera && identity.metadata.type === 0) ||
        (filters.hortelanos && identity.metadata.type === 1) ||
        (filters.invernadero && identity.metadata.type === 2) ||
        (filters.colaboradores && identity.metadata.type === 3) ||
        (filters.inactivos && identity.account.status === 0)
      );
    },
    searchFn: (identity, term) => {
      const normalized = term.toLowerCase();
      return (
        identity.user.displayName?.toLowerCase().includes(normalized) ||
        identity.metadata.dni?.toLowerCase().includes(normalized) ||
        String(identity.metadata.memberNumber).includes(normalized) ||
        String(identity.metadata.plotNumber).includes(normalized)
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

  const listaEsperaOrdenada = data ? data
    .filter(identity => identity.metadata.type === 0 && identity.account.status !== 0)
    .sort((a, b) => new Date(a.metadata.createdAt) - new Date(b.metadata.createdAt)) : [];

  const handleCreate = () => {
    setCreatingSocio(true);
    const socio = {
      userId: null,
      userName: "nuevo" + Date.now(),
      email: "",
      displayName: "Nuevo Socio",
      role: 0,
      globalStatus: 1,
      memberNumber: "",
      plotNumber: "",
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
    setFieldErrors(null);
  };

  const handleCreateSubmit = async (newSocio) => {
    try {
      newSocio.userName = newSocio.displayName.split(" ")[0].toLowerCase() + newSocio.memberNumber;
      await postData(reqConfig.baseUrl, newSocio, true);
      setCreatingSocio(false);
      setTempSocio(null);
      setFieldErrors(null);
    } catch (err) {
      setTempSocio({ ...newSocio });
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const handleEditSubmit = async (updatedSocio, userId) => {
    console.log(updatedSocio);
    try {
      await putData(`${reqConfig.baseUrl}/${userId}`, updatedSocio, true);
    } catch (err) {
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
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
    setIncomeFieldErrors(null);

    try {
      const url = reqConfig.incomesUrl.replace(":memberNumber", memberNumber);
      const res = await getData(url);
      setIncomes(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIncomesLoading(false);
    }
  };

  const handleIncomeUpdate = async (editado) => {
    try {
      await putData(`${reqConfig.rawIncomesUrl}/${editado.incomeId}`, editado);
      await handleViewIncomes(selectedMemberNumber);
    } catch (err) {
      if (err?.status === 422 && err?.errors) {
        setIncomeFieldErrors(err.errors);
      }
    }
  };

  const showPDFPopup = () => setShowPDFModal(true);
  const closePDFPopup = () => setShowPDFModal(false);

  const handleExportAll = () => {
    
  }

  const handleExportNew = () => {

  }

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

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
        >
          <AnimatedDropdown variant='transparent' icon={<FontAwesomeIcon icon={faAt} className='fa-md' />}>
            <SociosExportarCorreo 
              onAll={handleExportAll} 
              onNew={handleExportNew} 
            />
          </AnimatedDropdown>
          <AnimatedDropdown variant="transparent" icon={<FontAwesomeIcon icon={faFilter} className='fa-md' />}>
            <SociosFilter filters={filters} onChange={setFilters} />
          </AnimatedDropdown>
          <Button variant="transparent" onClick={showPDFPopup}>
            <FontAwesomeIcon icon={faFilePdf} className='fa-md' />
          </Button>
        </SearchToolbar>

        <PaginatedCardGrid
          items={filtered}
          creatingItem={creatingSocio}
          renderCreatingCard={() => (
            <SocioCard
              socio={tempSocio}
              isNew
              onCreate={handleCreateSubmit}
              onCancel={handleCancelCreate}
              fieldErrors={fieldErrors}
            />
          )}
          renderCard={(identity) => {
            const position = identity.metadata.type === 0
              ? listaEsperaOrdenada.findIndex(i => i.user.userId === identity.user.userId) + 1
              : null;

            return (
              <SocioCard
                key={identity.user.userId}
                identity={identity}
                onUpdate={handleEditSubmit}
                onDelete={handleDelete}
                onCancel={handleCancelCreate}
                onViewIncomes={() => handleViewIncomes(identity.metadata.memberNumber)}
                positionIfWaitlist={position}
                fieldErrors={fieldErrors}
              />
            );
          }}

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
        {!incomesLoading && incomes.length === 0 && (
          <p className="text-center my-3">Este socio no tiene ingresos registrados.</p>
        )}
        <div className="d-flex flex-wrap gap-3 p-3 justify-content-start">
          {incomes.map((income) => (
            <IngresoCard key={income.incomeId} income={income}
              onUpdate={handleIncomeUpdate} className='from-members' fieldErrors={incomeFieldErrors} />
          ))}
        </div>
      </CustomModal>

      <CustomModal
        title="Confirmar eliminación"
        show={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
      >
        <p className='p-3'>¿Estás seguro de que quieres eliminar este socio?</p>
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

    </CustomContainer>
  );
};

export default Socios;

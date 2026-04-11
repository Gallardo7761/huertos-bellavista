import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useState } from 'react';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import SolicitudCard from '../components/Solicitudes/SolicitudCard';
import { Button } from 'react-bootstrap';
import CustomModal from '../components/CustomModal';
import { useError } from '../context/ErrorContext';

const PAGE_SIZE = 10;

const Solicitudes = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.full,
    rawUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.all,
    acceptUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.accept,
    rejectUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.reject,
    params: {}
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <SolicitudesContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const SolicitudesContent = ({ reqConfig }) => {
  const { data, dataLoading, putData, deleteData } = useDataContext();
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    searchFn: (entry, term) => {
      const normalized = term.toLowerCase();
      return (
        entry.preDisplayName?.toLowerCase().includes(normalized) ||
        entry.preDni?.toLowerCase().includes(normalized) ||
        entry.preEmail?.toLowerCase().includes(normalized) ||
        String(entry.prePhone).includes(normalized)
      );
    },
    sortFn: (a, b) => a.status - b.status
  });

  const handleAccept = async (entry) => {
    const url = reqConfig.acceptUrl.replace(":requestId", entry.requestId);
    try {
      await putData(url, {});
      setSearchTerm("");
    } catch (err) {
      console.error("❌ Error al aceptar solicitud:", err.message);
    }
  };

  const handleReject = async (entry) => {
    const url = reqConfig.rejectUrl.replace(":requestId", entry.requestId);
    try {
      await putData(url, {});
      setSearchTerm("");
    } catch (err) {
      console.error("❌ Error al rechazar solicitud:", err.message);
    }
  };


  const handleDelete = async (id) => {
    setDeleteTargetId(id);
  }

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex flex-column align-items-center m-0 p-0">
          <h1 className='section-title me-auto'>Panel de Solicitudes</h1>
          <h5 className='me-auto'>Es necesario asignarle manualmente una contraseña al socio en caso de
            aceptar su solicitud tanto de alta como de nuevo colaborador.</h5>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
            
        <PaginatedCardGrid
          items={filtered}
          renderCard={(entry, idx) => (
            <SolicitudCard
              key={entry.requestId}
              data={{ ...entry, idx }}
              onAccept={() => handleAccept(entry)}
              onReject={() => handleReject(entry)}
              onDelete={handleDelete}
            />
          )}
        />

        <CustomModal
          title="Confirmar eliminación"
          show={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
        >
          <p className='p-3'>¿Estás seguro de que quieres eliminar la solicitud manualmente?</p>
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

export default Solicitudes;

import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import { usePaginatedList } from '../hooks/usePaginatedList';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import SolicitudCard from '../components/Solicitudes/SolicitudCard';

const PAGE_SIZE = 10;

const Solicitudes = () => {
  const { config, configLoading } = useConfig();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.allWithPreUsers,
    rawUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.all,
    acceptUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.accept,
    rejectUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.reject,
    params: {}
  };

  return (
    <DataProvider config={reqConfig}>
      <SolicitudesContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const SolicitudesContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, putData, deleteData } = useDataContext();

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
        entry.pre_display_name?.toLowerCase().includes(normalized) ||
        entry.pre_dni?.toLowerCase().includes(normalized) ||
        entry.pre_email?.toLowerCase().includes(normalized) ||
        String(entry.pre_phone).includes(normalized)
      );
    }
  });

  const handleAccept = async (entry) => {
    const url = reqConfig.acceptUrl.replace(":request_id", entry.request_id);
    try {
      await putData(url, {});
      console.log("✅ Solicitud aceptada:", entry.request_id);
    } catch (err) {
      console.error("❌ Error al aceptar solicitud:", err.message);
    }
  };
  
  const handleReject = async (entry) => {
    const url = reqConfig.rejectUrl.replace(":request_id", entry.request_id);
    try {
      await putData(url, {});
      console.log("🛑 Solicitud rechazada:", entry.request_id);
    } catch (err) {
      console.error("❌ Error al rechazar solicitud:", err.message);
    }
  };  

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar esta solicitud manualmente?`)) return;
    try {
      await deleteData(`${reqConfig.rawUrl}/${id}`);
      setSearchTerm("");
    } catch (err) {
      console.error(err);
    }
  }

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className='section-title'>Panel de Solicitudes</h1>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          hideCreate
          hidePDF
        />

        <PaginatedCardGrid
          items={filtered}
          renderCard={(entry) => (
            <SolicitudCard
              key={entry.request_id}
              data={entry}
              onAccept={() => handleAccept(entry)}
              onReject={() => handleReject(entry)}
              onDelete={handleDelete}
            />
          )}
        />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Solicitudes;

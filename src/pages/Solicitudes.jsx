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
    try {
      await putData(`${reqConfig.rawUrl}/${entry.request_id}`, {
        ...entry,
        status: 1
      });
      console.log("✅ Solicitud aceptada:", entry.request_id);
    } catch (err) {
      console.error("❌ Error al aceptar solicitud:", err.message);
    }
  };

  const handleReject = async (entry) => {
    try {  
      // 1. Si tiene preusuario, eliminarlo
      if (entry.pre_user_id) {
        const preUserUrl = reqConfig.rawUrl.replace("requests", "pre_users") + `/${entry.pre_user_id}`;
        await deleteData(preUserUrl);
        console.log("🗑️ Preusuario eliminado:", entry.pre_user_id);
      }
  
      // 2. Rechazar la solicitud
      const requestUrl = `${reqConfig.rawUrl}/${entry.request_id}`;
      await putData(requestUrl, { ...entry, status: 2 });
  
      console.log("🛑 Solicitud rechazada:", entry.request_id);
    } catch (err) {
      console.error("❌ Error al rechazar solicitud:", err.message);
    }
  };  

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
            />
          )}
        />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Solicitudes;

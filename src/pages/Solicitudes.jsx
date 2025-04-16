import { useData } from '../hooks/useData';
import { DataProvider } from '../context/DataContext';
import { useConfig } from '../hooks/useConfig';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import SolicitudCard from '../components/Solicitudes/SolicitudCard';

import { usePaginatedList } from '../hooks/usePaginatedList';

const PAGE_SIZE = 10;

const Solicitudes = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const HOST = config?.apiConfig.baseUrl;
  const BASE = `${HOST}`;
  const ENDPOINT = config?.apiConfig.endpoints.requests.allWithPreUsers; // asegúrate que apunta a /raw/v1/requests/with_pre_users

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {}
  };

  return (
    <DataProvider config={reqConfig}>
      <SolicitudesContent config={reqConfig} />
    </DataProvider>
  );
};

const SolicitudesContent = ({ config }) => {
  const { data, dataLoading, dataError, putData } = useData(config);

  const {
    paginated,
    filtered,
    searchTerm,
    setSearchTerm,
    loaderRef,
    loading,
    isUsingFilters: usingSearch
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
      await putData(`${config.baseUrl}/${entry.request_id}`, {
        ...entry,
        request_status: 1
      });
      console.log("Solicitud aceptada:", entry.request_id);
    } catch (err) {
      console.error("Error al aceptar solicitud:", err.message);
    }
  };

  const handleReject = async (entry) => {
    try {
      await putData(`${config.baseUrl}/${entry.request_id}`, {
        ...entry,
        request_status: 2
      });
      console.log("Solicitud rechazada:", entry.request_id);
    } catch (err) {
      console.error("Error al rechazar solicitud:", err.message);
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
          items={usingSearch ? filtered : paginated}
          loaderRef={loaderRef}
          loading={loading}
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

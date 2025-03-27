import { useState, useRef } from 'react';
import SocioCard from '../components/Socios/SocioCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../css/Socios.css';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';

import { useData } from '../hooks/useData';
import { DataProvider } from '../context/DataContext';
import { useConfig } from '../hooks/useConfig';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const PAGE_SIZE = config.apiConfig.pageSize;
  const BASE = config.apiConfig.baseUrl;
  const ENDPOINT = config.apiConfig.endpoints.socios;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {}
  };

  return (
    <DataProvider config={reqConfig}>
      <SociosContent />
    </DataProvider>
  );
}

const SociosContent = () => {
  const { data, dataLoading, dataError } = useData();
  const [socios, setSocios] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const loaderRef = useRef();

  const loadMore = () => {
    if (loading || !data) return;
    setLoading(true);

    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const newSocios = data.slice(start, end);

      setSocios(prev => [...prev, ...newSocios]);
      setPage(prev => prev + 1);
      setLoading(false);

      if (end >= data.length) {
        setHasMore(false);
      }
    }, 500);
  };

  useInfiniteScroll(loaderRef, loadMore, hasMore);

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className='section-title'>Lista de Socios</h1>
          <div className="d-flex m-0 p-0 gap-2">
            <Button variant="secondary" onClick={() => setShowSearchBar(!showSearchBar)}>
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
            </Button>
            <Button variant="primary" href="/socios/nuevo">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
            </Button>
          </div>
        </div>
        <hr className="section-divider" />
        {showSearchBar && (
          <input
            type="text"
            className="search-bar w-100 mb-5 shadow-sm"
            placeholder="Buscar socio..."
          />
        )}
        <div className="cards-grid">
          {socios.map(socio => (
            <SocioCard key={socio.idSocio} socio={socio} />
          ))}
        </div>
        <div ref={loaderRef} className="loading-trigger">
          {loading && <LoadingIcon />}
        </div>
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Socios;
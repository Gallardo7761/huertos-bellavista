import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { DataProvider } from '../context/DataContext';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import AnuncioCard from '../components/Anuncios/AnuncioCard';
import AnunciosFilter from '../components/Anuncios/AnunciosFilter';

const PAGE_SIZE = 10;

const Anuncios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const BASE = config.apiConfig.baseUrl;
  const ENDPOINT = config.apiConfig.endpoints.announces.all;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {
      _sort: 'created_at',
      _order: 'desc'
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <AnunciosContent config={reqConfig} />
    </DataProvider>
  );
};

const AnunciosContent = ({ config }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useData();

  const {
    paginated,
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loaderRef,
    loading,
    creatingItem: creatingAnuncio,
    setCreatingItem: setCreatingAnuncio,
    tempItem: tempAnuncio,
    setTempItem: setTempAnuncio,
    isUsingFilters: usingSearchOrFilters
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    filterFn: (anuncio, filters) => {
      if (filters.todos) return true;
      const matchesPrioridad =
        (filters.baja && anuncio.priority === 0) ||
        (filters.media && anuncio.priority === 1) ||
        (filters.alta && anuncio.priority === 2);

      const createdAt = new Date(anuncio.created_at);
      const now = new Date();

      const matchesFecha =
        (filters.ultimos7 && (now - createdAt) / (1000 * 60 * 60 * 24) <= 7) ||
        (filters.esteMes && createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear());

      return matchesPrioridad || matchesFecha;
    },
    searchFn: (anuncio, term) => {
      const normalized = term.toLowerCase();
      return (
        anuncio.body?.toLowerCase().includes(normalized) ||
        anuncio.published_by_name?.toLowerCase().includes(normalized)
      );
    },
    initialFilters: {
      todos: true,
      baja: true,
      media: true,
      alta: true,
      ultimos7: true,
      esteMes: true
    }
  });

  useInfiniteScroll(loaderRef, loading);

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingAnuncio(true);
    setTempAnuncio({
      announce_id: null,
      body: 'Nuevo anuncio',
      priority: 1,
      published_by_name: 'Admin'
    });
    grid.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingAnuncio(false);
    setTempAnuncio(null);
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(config.baseUrl, nuevo);
      setCreatingAnuncio(false);
      setTempAnuncio(null);
    } catch (err) {
      console.error("Error al crear anuncio:", err.message);
    }
  };

  const handleEditSubmit = async (editado, id) => {
    try {
      await putData(`${config.baseUrl}/${id}`, editado);
    } catch (err) {
      console.error("Error al editar anuncio:", err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este anuncio?");
    if (!confirmed) return;

    try {
      await deleteData(`${config.baseUrl}/${id}`);
    } catch (err) {
      console.error("Error al eliminar anuncio:", err.message);
    }
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className='section-title'>Tablón de Anuncios</h1>
        </div>

        <hr className="section-divider" />

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtersComponent={<AnunciosFilter filters={filters} onChange={setFilters} />}
          onCreate={handleCreate}
        />

        <PaginatedCardGrid
          items={usingSearchOrFilters ? filtered : paginated}
          loaderRef={loaderRef}
          loading={loading}
          creatingItem={creatingAnuncio}
          renderCreatingCard={() => (
            <AnuncioCard
              anuncio={tempAnuncio}
              isNew
              onCreate={handleCreateSubmit}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
          renderCard={(anuncio) => (
            <AnuncioCard
              key={anuncio.announce_id}
              anuncio={anuncio}
              onEdit={(a) => handleEditSubmit(a, a.announce_id)}
              onDelete={() => handleDelete(anuncio.announce_id)}
            />
          )}
        />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Anuncios;

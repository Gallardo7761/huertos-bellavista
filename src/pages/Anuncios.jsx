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
import AnuncioCard from '../components/Anuncios/AnuncioCard';
import AnunciosFilter from '../components/Anuncios/AnunciosFilter';

import { errorParser } from '../util/parsers/errorParser';

const PAGE_SIZE = 10;

const Anuncios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.announces.all}`,
    params: {
      _sort: 'created_at',
      _order: 'desc',
    },
  };

  return (
    <DataProvider config={reqConfig}>
      <AnunciosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const AnunciosContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useDataContext();
  const [creatingAnuncio, setCreatingAnuncio] = useState(false);
  const [tempAnuncio, setTempAnuncio] = useState(null);
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
        (filters.esteMes &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear());
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
      esteMes: true,
    },
  });

  const handleCreate = () => {
    setCreatingAnuncio(true);
    setTempAnuncio({
      announce_id: null,
      body: 'Nuevo anuncio',
      priority: 1,
      published_by_name: 'Admin',
    });
    document.querySelector('.cards-grid')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingAnuncio(false);
    setTempAnuncio(null);
  };

  const handleCreateSubmit = async (nuevo) => {
    try {
      await postData(reqConfig.baseUrl, nuevo);
      setError(null);
      setCreatingAnuncio(false);
      setTempAnuncio(null);
    } catch (err) {
      setTempAnuncio({ ...nuevo });
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
    if (!window.confirm("¿Estás seguro de que quieres eliminar este anuncio?")) return;
    try {
      await deleteData(`${reqConfig.baseUrl}/${id}`);
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
          items={filtered}
          creatingItem={creatingAnuncio}
          renderCreatingCard={() => (
            <AnuncioCard
              anuncio={tempAnuncio}
              isNew
              onCreate={handleCreateSubmit}
              onCancel={handleCancelCreate}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
          renderCard={(anuncio) => (
            <AnuncioCard
              key={anuncio.announce_id}
              anuncio={anuncio}
              onUpdate={(a, id) => handleEditSubmit(a, id)}
              onDelete={() => handleDelete(anuncio.announce_id)}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
        />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Anuncios;

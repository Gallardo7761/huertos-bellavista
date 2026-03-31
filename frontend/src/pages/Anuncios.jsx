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

import CustomModal from '../components/CustomModal';
import { Button } from 'react-bootstrap';
import { EditorProvider } from 'react-simple-wysiwyg';
import { useError } from '../context/ErrorContext';

const PAGE_SIZE = 10;

const Anuncios = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.announcements.all}`,
    params: {},
  };

  return (
    <DataProvider config={reqConfig} onError={showError} >
      <AnunciosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const AnunciosContent = ({ reqConfig }) => {
  const { data, dataLoading, postData, putData, deleteData } = useDataContext();
  const [creatingAnuncio, setCreatingAnuncio] = useState(false);
  const [tempAnuncio, setTempAnuncio] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
      const createdAt = new Date(anuncio.createdAt);
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
        anuncio.publishedByName?.toLowerCase().includes(normalized)
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
      body: 'Nuevo anuncio',
      priority: 1,
      publishedBy: JSON.parse(localStorage.getItem("identity"))?.user?.displayName,
      createdAt: Date.now()
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
      setCreatingAnuncio(false);
      setTempAnuncio(null);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setTempAnuncio({ ...nuevo });
    }
  };

  const handleEditSubmit = async (editado, id) => {
    await putData(`${reqConfig.baseUrl}/${id}`, editado);
  };

  const handleDelete = async (id) => {
    setDeleteTargetId(id);
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

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
            <EditorProvider>
              <AnuncioCard
                anuncio={tempAnuncio}
                isNew
                onCreate={handleCreateSubmit}
                onCancel={handleCancelCreate}
              />
            </EditorProvider>
          )}
          renderCard={(anuncio, idx) => (
            <AnuncioCard
              key={anuncio.announcementId}
              anuncio={{...anuncio, idx: idx}}
              onUpdate={(a, id) => handleEditSubmit(a, id)}
              onDelete={() => handleDelete(anuncio.announcementId)}
            />
          )}
        />

        <CustomModal
          title="Confirmar eliminación"
          show={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
        >
          <p className='p-3'>¿Estás seguro de que quieres eliminar el anuncio?</p>
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

      </ContentWrapper>
    </CustomContainer>
  );
};

export default Anuncios;

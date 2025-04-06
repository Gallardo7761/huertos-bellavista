// Socios.jsx adaptado al nuevo modelo plano de datos
import { useState, useMemo, useRef } from 'react';
import SocioCard from '../components/Socios/SocioCard';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../css/Socios.css';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import AnimatedDropdown from '../components/AnimatedDropdown';
import SociosFilter from '../components/Socios/SociosFilter';

import { useData } from '../hooks/useData';
import { DataProvider } from '../context/DataContext';
import { useConfig } from '../hooks/useConfig';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf, faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SociosPDF } from '../components/Socios/SociosPDF';
import { PDFViewer } from '@react-pdf/renderer';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const HOST = config.apiConfig.baseUrl;
  const BASE = `${HOST}`;
  const ENDPOINT = config.apiConfig.endpoints.members.all;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {
      _sort: "member_number",
      _order: "asc"
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <SociosContent config={reqConfig} />
    </DataProvider>
  );
};

const SociosContent = ({ config }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useData();
  const [_socios, setSocios] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    todos: true,
    listaEspera: true,
    invernadero: true,
    inactivos: true,
    colaboradores: true,
    hortelanos: true
  });
  const [creatingSocio, setCreatingSocio] = useState(null);
  const [tempSocio, setTempSocio] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const isSearching = searchTerm.trim() !== "";
  const isFiltering = !filters.todos;
  const usingSearchOrFilters = isSearching || isFiltering;

  const filteredSocios = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    if (!filters.todos) {
      result = result.filter((s) =>
        (filters.listaEspera && s.type === 0) ||
        (filters.hortelanos && s.type === 1) ||
        (filters.invernadero && s.type === 2) ||
        (filters.colaboradores && s.type === 3) ||
        (filters.inactivos && s.status === 0)
      );
    }

    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      result = result.filter((s) =>
        s.display_name?.toLowerCase().includes(normalized) ||
        s.dni?.toLowerCase().includes(normalized) ||
        String(s.member_number).includes(normalized) ||
        String(s.plot_number).includes(normalized)
      );
    }

    return result;
  }, [data, filters, searchTerm]);

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

  useInfiniteScroll(loaderRef, loadMore, hasMore && !usingSearchOrFilters);

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingSocio(true);

    const now = Date.now();

    let tempSocio = {
      user_id: null,
      user_name: "nuevo" + now,
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

    setTempSocio(tempSocio);
    grid.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingSocio(false);
    setTempSocio(null);
  };

  const handleCreateSubmit = async (newSocio) => {
    try {
      const res = await postData(config.baseUrl, newSocio);
      console.log("Socio creado:", res);
      setCreatingSocio(false);
      setTempSocio(null);
    } catch (err) {
      console.error("Error al crear socio:", err.message);
    }
  };

  const handleEditSubmit = async (updatedSocio, userId) => {
    try {
      const res = await putData(`${config.baseUrl}/${userId}`, updatedSocio);
      console.log("Socio actualizado:", res);
      setSocios(prev =>
        prev.map((s) =>
          s.user_id === updatedSocio.user_id ? { ...s, ...updatedSocio } : s
        )
      );
    } catch (err) {
      console.error("Error al actualizar socio:", err.message);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el socio con ID ${userId}?`);
    if (!confirmed) return;

    try {
      await deleteData(`${config.baseUrl}/${userId}`);
      console.log("Socio eliminado correctamente");
      setSearchTerm("");
    } catch (err) {
      console.error("Error al eliminar socio:", err.message);
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
        <div className="sticky-toolbar search-toolbar-wrapper">
          <div className="search-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="toolbar-buttons">
              <AnimatedDropdown
                variant="transparent"
                icon={<FontAwesomeIcon icon={faFilter} className='fa-md' />}
              >
                <SociosFilter filters={filters} onChange={setFilters} />
              </AnimatedDropdown>
              <Button variant="transparent" onClick={showPDFPopup}>
                <FontAwesomeIcon icon={faFilePdf} className='fa-md' />
              </Button>
              <Button variant="transparent" onClick={handleCreate}>
                <FontAwesomeIcon icon={faPlus} className='fa-md' />
              </Button>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {creatingSocio && (
            <SocioCard
              socio={tempSocio}
              isNew
              onCreate={handleCreateSubmit}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}

          {(usingSearchOrFilters ? filteredSocios : _socios)
            .sort((a, b) => a.member_number - b.member_number)
            .map((socio) => (
              <SocioCard
                key={socio.user_id}
                socio={socio}
                onUpdate={handleEditSubmit}
                onDelete={handleDelete}
                onCancel={handleCancelCreate}
              />
            ))}
        </div>

        <div ref={loaderRef} className="loading-trigger">
          {loading && <LoadingIcon />}
        </div>
      </ContentWrapper>

      <Modal show={showPDFModal} onHide={closePDFPopup} size="xl" centered>
        <Modal.Header className='justify-content-between'>
          <Modal.Title>Vista previa del PDF</Modal.Title>
          <Button variant='transparent' onClick={closePDFPopup}>
            <FontAwesomeIcon icon={faXmark} className='close-button fa-xl' />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          <PDFViewer width="100%" height="100%">
            <SociosPDF socios={filteredSocios} />
          </PDFViewer>
        </Modal.Body>
      </Modal>
    </CustomContainer>
  );
};

export default Socios;

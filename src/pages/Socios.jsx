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
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf, faFilter } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const BASE = config.apiConfig.baseUrl;
  const ENDPOINT = config.apiConfig.endpoints.socios;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    params: {}
  };

  return (
    <DataProvider config={reqConfig}>
      <SociosContent config={reqConfig} />
    </DataProvider>
  );
}

const SociosContent = ({ config }) => {
  // Hooks y estados
  const { data, dataLoading, dataError, postData, putData, deleteData } = useData();
  const [_socios, setSocios] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    todos: true,
    listaEspera: false,
    invernadero: false,
    inactivos: false,
    colaboradores: false,
    hortelanos: false
  });
  const [creatingSocio, setCreatingSocio] = useState(null);
  const [tempSocio, setTempSocio] = useState(null);

  const isSearching = searchTerm.trim() !== "";
  const isFiltering = !filters.todos;
  const usingSearchOrFilters = isSearching || isFiltering;

  const filteredSocios = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Filtro por tipo (filtros por checkbox)
    if (!filters.todos) {
      result = result.filter((s) =>
        (filters.listaEspera && s.tipo === 'LISTA_ESPERA') ||
        (filters.invernadero && s.tipo === 'HORTELANO_INVERNADERO') ||
        (filters.colaboradores && s.tipo === 'COLABORADOR') ||
        (filters.hortelanos && s.tipo === 'HORTELANO') ||
        (filters.inactivos && s.estado === 0)
      );
    }

    // Búsqueda por texto
    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      result = result.filter((s) =>
        s.nombre?.toLowerCase().includes(normalized) ||
        s.dni?.toLowerCase().includes(normalized) ||
        String(s.numeroSocio).includes(normalized) ||
        String(s.numeroHuerto).includes(normalized)
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
    let tempSocio = {
      idSocio: null,
      nombre: "Nuevo Socio",
      usuario: "",
      dni: "",
      telefono: "",
      email: "",
      notas: "",
      numeroSocio: "",
      numeroHuerto: "",
      estado: 1,
      tipo: "HORTELANO",
      fechaDeAlta: new Date().toISOString().split("T")[0]
    };

    tempSocio.usuario = tempSocio.nombre.split(" ")[0].toLowerCase() + String(tempSocio.numeroSocio);

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

  const handleEditSubmit = async (updatedSocio, idSocio) => {
    try {
      const res = await putData(`${config.baseUrl}/${idSocio}`, updatedSocio);
  
      console.log("Socio actualizado:", res);
  
      // Actualiza el socio localmente si está en _socios
      setSocios(prev =>
        prev.map((s) =>
          s.idSocio === updatedSocio.idSocio ? { ...s, ...updatedSocio } : s
        )
      );
    } catch (err) {
      console.error("Error al actualizar socio:", err.message);
    }
  };

  const handleDelete = async (idSocio) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el socio con ID ${idSocio}?`);
  
    if (!confirmed) return;
  
    try {
      await deleteData(`${config.baseUrl}/${idSocio}`);
      console.log("Socio eliminado correctamente");
      setSearchTerm("");
    } catch (err) {
      console.error("Error al eliminar socio:", err.message);
    }
  };

  // Checks de datos
  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex justify-content-between align-items-center m-0 p-0">
          <h1 className='section-title'>Lista de Socios</h1>
        </div>
        <hr className="section-divider" />
        <div className="sticky-toolbar">
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="search-bar flex-grow-1 shadow-sm"
              placeholder="Buscar socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AnimatedDropdown
              variant="warning"
              icon={<FontAwesomeIcon icon={faFilter} className="fa-xl" />}
            >
              <SociosFilter filters={filters} onChange={setFilters} />
            </AnimatedDropdown>
            <Button variant="danger" disabled className="circle-btn">
              <FontAwesomeIcon icon={faFilePdf} className="fa-xl" />
            </Button>
            <Button variant="primary" className="circle-btn" onClick={handleCreate}>
              <FontAwesomeIcon icon={faPlus} className="fa-xl" />
            </Button>
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
            .sort((a, b) => a.numeroSocio - b.numeroSocio)
            .map((socio) => (
              <SocioCard
                key={socio.idSocio}
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
    </CustomContainer>
  );
};

export default Socios;
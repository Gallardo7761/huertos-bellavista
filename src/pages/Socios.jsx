import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import { usePaginatedList } from '../hooks/usePaginatedList';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PDFModal from '../components/PDFModal';
import SociosFilter from '../components/Socios/SociosFilter';
import SocioCard from '../components/Socios/SocioCard';
import { SociosPDF } from '../components/Socios/SociosPDF';
import PaginatedCardGrid from '../components/PaginatedCardGrid';

import '../css/Socios.css';

const PAGE_SIZE = 10;

const Socios = () => {
  const { config, configLoading } = useConfig();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.members.all}`,
    params: {
      _sort: "member_number",
      _order: "asc"
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <SociosContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const SociosContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useDataContext();

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [creatingSocio, setCreatingSocio] = useState(false);
  const [tempSocio, setTempSocio] = useState(null);

  const {
    filtered,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters
  } = usePaginatedList({
    data,
    pageSize: PAGE_SIZE,
    filterFn: (socio, filters) => {
      if (filters.todos) return true;
      return (
        (filters.listaEspera && socio.type === 0) ||
        (filters.hortelanos && socio.type === 1) ||
        (filters.invernadero && socio.type === 2) ||
        (filters.colaboradores && socio.type === 3) ||
        (filters.inactivos && socio.status === 0)
      );
    },
    searchFn: (socio, term) => {
      const normalized = term.toLowerCase();
      return (
        socio.display_name?.toLowerCase().includes(normalized) ||
        socio.dni?.toLowerCase().includes(normalized) ||
        String(socio.member_number).includes(normalized) ||
        String(socio.plot_number).includes(normalized)
      );
    },
    initialFilters: {
      todos: true,
      listaEspera: true,
      invernadero: true,
      inactivos: true,
      colaboradores: true,
      hortelanos: true
    }
  });

  const handleCreate = () => {
    const grid = document.querySelector('.cards-grid');
    setCreatingSocio(true);
    const nuevo = {
      user_id: null,
      user_name: "nuevo" + Date.now(),
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
    nuevo.user_name = nuevo.display_name.split(" ")[0].toLowerCase() + nuevo.member_number;
    setTempSocio(nuevo);
    grid.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCreate = () => {
    setCreatingSocio(false);
    setTempSocio(null);
  };

  const handleCreateSubmit = async (newSocio) => {
    try {
      const usuario = newSocio.display_name.split(" ")[0].toLowerCase() + newSocio.member_number;
      newSocio.user_name = usuario;
      await postData(reqConfig.baseUrl, newSocio);
      setCreatingSocio(false);
      setTempSocio(null);
    } catch (err) {
      console.error("Error al crear socio:", err.message);
    }
  };

  const handleEditSubmit = async (updatedSocio, userId) => {
    try {
      await putData(`${reqConfig.baseUrl}/${userId}`, updatedSocio);
    } catch (err) {
      console.error("Error al actualizar socio:", err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el socio con ID ${userId}?`)) return;
    try {
      await deleteData(`${reqConfig.baseUrl}/${userId}`);
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

        <SearchToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filtersComponent={<SociosFilter filters={filters} onChange={setFilters} />}
          onCreate={handleCreate}
          onPDF={showPDFPopup}
        />

        <PaginatedCardGrid
          items={filtered}
          creatingItem={creatingSocio}
          renderCreatingCard={() => (
            <SocioCard
              socio={tempSocio}
              isNew
              onCreate={handleCreateSubmit}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
          renderCard={(socio) => (
            <SocioCard
              key={socio.user_id}
              socio={socio}
              onUpdate={handleEditSubmit}
              onDelete={handleDelete}
              onCancel={handleCancelCreate}
            />
          )}
        />
      </ContentWrapper>

      <PDFModal show={showPDFModal} onClose={closePDFPopup} title="Vista previa del PDF">
        <SociosPDF socios={filtered} />
      </PDFModal>
    </CustomContainer>
  );
};

export default Socios;

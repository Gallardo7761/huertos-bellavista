import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useConfig } from '../hooks/useConfig';
import { useAuth } from '../hooks/useAuth';
import { useDataContext } from '../hooks/useDataContext';
import { DataProvider } from '../context/DataContext';

import List from '../components/List';
import { DateParser } from '../util/parsers/dateParser';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import PreUserForm from '../components/Solicitudes/PreUserForm';
import CustomModal from '../components/CustomModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import IfNotAuthenticated from '../components/Auth/IfNotAuthenticated';

const ListaEspera = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.members.limitedWaitlist,
    requestUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.all,
    preUsersUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.pre_users.all,
    params: {}
  };

  return (
    <DataProvider config={reqConfig}>
      <ListaEsperaContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const ListaEsperaContent = ({ reqConfig }) => {
  const { authStatus } = useAuth();
  const { data, dataLoading, dataError } = useDataContext();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showPreUserFormModal, setShowPreUserFormModal] = useState(false);

  useEffect(() => {
    if (authStatus !== 'authenticated' && authStatus !== 'unauthenticated') return;

    if (authStatus === 'authenticated') {
      setShowWelcomeModal(false);
      return;
    }

    const hasSeenModal = localStorage.getItem('welcomeModalSeen') === 'true';
    if (!hasSeenModal) {
      setShowWelcomeModal(true);
      localStorage.setItem('welcomeModalSeen', 'true');
    }
  }, [authStatus]);

  const handleRegisterSubmit = async (formData) => {
    try {
      const requestRes = await fetch(reqConfig.requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 0,
          status: 0
        })
      });

      const requestJson = await requestRes.json();
      const requestId = requestJson.data?.request_id;

      if (!requestRes.ok || !requestId) {
        alert("❌ No se pudo registrar la solicitud");
        return;
      }

      const preUserRes = await fetch(reqConfig.preUsersUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          request_id: requestId
        })
      });

      const preUserJson = await preUserRes.json();

      if (!preUserRes.ok) {
        alert(`❌ Error al registrar el preusuario: ${preUserJson.message}`);
        return;
      }

      alert("✅ Solicitud enviada correctamente. Te notificaremos por email cuando haya una respuesta.");
      setShowPreUserFormModal(false);
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      alert("❌ Error inesperado al enviar la solicitud. Inténtalo más tarde.");
    }
  };

  const handleOpenFormModal = () => {
    setShowWelcomeModal(false);
    setShowPreUserFormModal(true);
  };

  const mapped = [...(data ?? [])]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((item) => ({
      ...item,
      created_at: DateParser.timestampToString(item.created_at)
    }));

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <>
      <CustomContainer>
        <ContentWrapper>
          <div className="d-flex align-items-center m-0 p-0 justify-content-between">
            <h1 className="section-title">Lista de Espera</h1>
            <IfNotAuthenticated>
              <Button variant="danger" onClick={() => setShowPreUserFormModal(true)}>
                <FontAwesomeIcon icon={faPencil} className="me-2" />
                Apuntarme
              </Button>
            </IfNotAuthenticated>
          </div>
          <hr className="section-divider" />
          <List datos={mapped} config={{ title: 'display_name', subtitle: 'created_at', showIndex: true }} />
        </ContentWrapper>
      </CustomContainer>

      {authStatus === 'unauthenticated' && (
        <Modal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>¿Quieres unirte?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              Te puedes apuntar a la lista de espera clicando en el botón de abajo. Una persona de la directiva revisará tu solicitud y se te notificará por el medio de contacto que elijas si entras o no.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowWelcomeModal(false)}>
              Cerrar
            </Button>
            <Button variant="success" onClick={handleOpenFormModal}>
              Apuntarme
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <CustomModal title="Solicitud de Huerto" show={showPreUserFormModal} onClose={() => setShowPreUserFormModal(false)}>
        <PreUserForm onSubmit={handleRegisterSubmit} />
      </CustomModal>
    </>
  );
};

export default ListaEspera;

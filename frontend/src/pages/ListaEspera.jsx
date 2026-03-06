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
import NewUserForm from '../components/Solicitudes/NewUserForm';
import CustomModal from '../components/CustomModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import IfNotAuthenticated from '../components/Auth/IfNotAuthenticated';
import NotificationModal from '../components/NotificationModal';
import { useError } from '../context/ErrorContext';

const ListaEspera = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.users.waitlistLimited,
    requestUrl: config.apiConfig.baseUrl + config.apiConfig.endpoints.requests.all,
    params: {}
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <ListaEsperaContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const ListaEsperaContent = ({ reqConfig }) => {
  const { authStatus } = useAuth();
  const { data, dataLoading, postData } = useDataContext();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showNewUserFormModal, setShowNewUserFormModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
    setValidationErrors({});

    try {
      const request = await postData(
        reqConfig.requestUrl,
        {
          type: 0,
          status: 0,
          metadata: {
            displayName: formData.displayName,
            username: formData.username,
            dni: formData.dni,
            phone: formData.phone,
            email: formData.email,
            memberNumber: formData.memberNumber,
            plotNumber: formData.plotNumber,
            type: formData.type,
            address: formData.address,
            zipCode: formData.zipCode,
            city: formData.city
          }
        }
      );
      const requestId = request?.requestId;
      if (!requestId) throw new Error("No se pudo registrar la solicitud.");

      setShowNewUserFormModal(false);
      setShowConfirmationModal(true);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setValidationErrors(err.errors);
      } else {
        setShowNewUserFormModal(false);
      }
    }
  };

  const handleOpenFormModal = () => {
    setValidationErrors({});
    setShowWelcomeModal(false);
    setShowNewUserFormModal(true);
  };

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <div className="d-flex align-items-center m-0 p-0 justify-content-between">
          <h1 className="section-title">Lista de Espera</h1>
          <IfNotAuthenticated>
            <Button variant="danger" onClick={handleOpenFormModal}>
              <FontAwesomeIcon icon={faPencil} className="me-2" />
              Apuntarme
            </Button>
          </IfNotAuthenticated>
        </div>
        <hr className="section-divider" />
        <List datos={data} config={{ title: 'name', subtitle: '', showIndex: true }} />

        {authStatus === 'unauthenticated' && (
          <Modal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>¿Quieres unirte?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Puedes apuntarte a la lista de espera clicando en el botón de abajo. Una persona de la directiva revisará tu solicitud y se te notificará por email si entras o no.
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

        <CustomModal
          title="Solicitud de Huerto"
          show={showNewUserFormModal}
          onClose={() => {
            setShowNewUserFormModal(false);
            setValidationErrors({});
          }}
        >
          <NewUserForm
            userType={0}
            plotNumber={0}
            onSubmit={handleRegisterSubmit}
            fieldErrors={validationErrors}
          />
        </CustomModal>

        <NotificationModal
          show={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          title="Solicitud enviada"
          message="Tu solicitud ha sido enviada correctamente. Te notificaremos por email si entras o no."
          variant="success"
          buttons={[
            {
              label: 'Aceptar',
              variant: 'success',
              onClick: () => setShowConfirmationModal(false)
            }
          ]}
        />
      </ContentWrapper>
    </CustomContainer>
  );
};

export default ListaEspera;

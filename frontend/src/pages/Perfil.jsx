import { useConfig } from '../hooks/useConfig';
import { useDataContext } from '../hooks/useDataContext';
import { DataProvider } from '../context/DataContext';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';

import { Card, ListGroup, Form, FloatingLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faIdCard, faEnvelope, faPhone, faHashtag,
  faSeedling, faUserShield, faCalendar,
  faUserSlash, faUserPlus,
  faArrowRightFromBracket,
  faCog,
  faEyeSlash,
  faEye,
  faKey
} from '@fortawesome/free-solid-svg-icons';

import '../css/Perfil.css';

import { useState } from 'react';
import IngresoCard from '../components/Ingresos/IngresoCard';
import SolicitudCard from '../components/Solicitudes/SolicitudCard';
import CustomModal from '../components/CustomModal';
import NewUserForm from '../components/Solicitudes/NewUserForm';
import NotificationModal from '../components/NotificationModal';
import { Button, Col, Row } from 'react-bootstrap';
import AnimatedDropdown from '../components/AnimatedDropdown';
import { useAuth } from '../hooks/useAuth';
import { CONSTANTS } from '../util/constants';
import { useError } from '../context/ErrorContext';
import IfNotType from '../components/Auth/IfNotType';

const parseDate = (date) => {
  if (!date) return 'NO';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    1: 'farmer.svg',
    2: 'green_house.svg',
    0: 'list.svg',
    3: 'join.svg',
    4: 'subvencion4.svg',
    5: 'programmer.svg'
  };
  return base + (map[tipo] || 'farmer.svg');
};

const Perfil = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

  const buildUrl = (base, endpoint, params = {}) => {
    if (!endpoint) return null;
    let url = base + endpoint;
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, value);
    }
    return url;
  };

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.users.me}`,
    requestUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.requests.all),
    changePasswordUrl: buildUrl(config.apiConfig.coreUrl, config.apiConfig.endpoints.auth.changePassword),
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <PerfilContent config={reqConfig} />
    </DataProvider>
  );
};

const PerfilContent = ({ config }) => {
  const { data, dataLoading, postData } = useDataContext();
  const { logout } = useAuth();

  const identity = JSON.parse(localStorage.getItem("identity"));

  const myRequests = data?.requests ?? [];
  const incomes = data?.payments ?? [];

  const hasCollaborator = data?.hasCollaborator ?? false;
  const hasCollaboratorRequest = data?.hasCollaboratorRequest ?? false;
  const hasGreenHouse = data?.hasGreenhouse ?? false;
  const hasGreenHouseRequest = data?.hasGreenhouseRequest ?? false;

  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [showRemoveCollaboratorModal, setShowRemoveCollaboratorModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const closeFeedback = () => setFeedbackModal(null);
  const [fieldErrors, setFieldErrors] = useState(null);

  const baseMetadata = {
    displayName: identity.user.displayName,
    username: identity.account.username,
    dni: identity.metadata.dni,
    phone: identity.metadata.phone,
    email: identity.account.email,
    memberNumber: identity.metadata.memberNumber,
    plotNumber: identity.metadata.plotNumber,
    type: identity.metadata.type,
    role: identity.metadata.role
  };

  const sendSimpleRequest = async (type) => {
    setFieldErrors(null);
    const requestOf = type == 1 ? "baja" : type == 2 ? "adición de colaborador" :
      type == 3 ? "eliminación de colaborador" : type == 4 ? "adición de invernadero" :
        type == 5 ? "eliminación de invernadero" : "desconocido";
    try {
      await postData(config.requestUrl, {
        type,
        status: CONSTANTS.REQUEST_PENDING,
        userId: identity.user.userId,
        name: identity.user.displayName,
        metadata: baseMetadata
      });
      setFeedbackModal({
        title: 'Solicitud enviada',
        message: `Se ha enviado la solicitud de ${requestOf} correctamente.`,
        variant: 'success',
        onClick: closeFeedback
      });
    } catch (err) {
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const [newPasswordData, setNewPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    serviceId: identity.account.serviceId
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setNewPasswordData({
      ...newPasswordData,
      [e.target.name]: e.target.value
    });
    setFieldErrors(null);
  }

  const handleChangePassword = async () => {
    try {
      await postData(config.changePasswordUrl, {
        oldPassword: newPasswordData.oldPassword,
        newPassword: newPasswordData.newPassword,
        serviceId: identity.account.serviceId
      });

      setNewPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        serviceId: identity.account.serviceId
      });

      setFeedbackModal({
        title: 'Contraseña cambiada',
        message: 'Tu contraseña ha sido cambiada correctamente.',
        variant: 'success',
        onClick: () => {
          closeFeedback();
          logout();
        }
      });
    } catch (err) {
      if (err?.status === 422 && err?.errors) {
        setFieldErrors(err.errors);
      }
    }
  };

  const getFieldError = (field) => fieldErrors?.[field] ?? null;

  const mappedRequests = myRequests.map(r => ({
    ...r,
    type: r.type ?? r.type,
    status: r.status ?? r.status,
    request_createdAt: r.request_createdAt ?? r.createdAt
  }));

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <Row className='gap-2 justify-content-center'>
          <Col xs={12} md={4} className="mb-4">
            <Card className="shadow-sm rounded-4 perfil-card">
              <Card.Header className="bg-secondary text-white rounded-top-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={getPFP(identity.metadata.type)} alt="PFP" width={36} className="me-3" />
                  <div className="m-0 p-0">
                    <Card.Title className="mb-0">{`@${identity.account.username}`}</Card.Title>
                    <small>Te uniste el {parseDate(identity.metadata.createdAt)}</small>
                  </div>
                </div>

                <AnimatedDropdown
                  className="end-0"
                  buttonStyle="card-button"
                  icon={<FontAwesomeIcon icon={faCog} className="fa-xl" />}
                >
                  {({ closeDropdown }) => (
                    <>
                      <IfNotType types={[0]}>
                        {!hasGreenHouse && !hasGreenHouseRequest && (
                          <div className="dropdown-item d-flex align-items-center" onClick={() => {
                            sendSimpleRequest(CONSTANTS.REQUEST_TYPE_ADD_GREENHOUSE);
                            closeDropdown();
                          }}>
                            <FontAwesomeIcon icon={faSeedling} className="me-2" />Solicitar invernadero
                          </div>
                        )}
                        {!hasCollaborator && !hasCollaboratorRequest && (
                          <div className="dropdown-item d-flex align-items-center" onClick={() => {
                            setShowAddCollaboratorModal(true);
                            setFieldErrors(null);
                            closeDropdown();
                          }}>
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />Añadir un colaborador
                          </div>
                        )}
                        <hr className="dropdown-divider" />
                        {hasGreenHouse && !hasGreenHouseRequest && (
                          <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => {
                            sendSimpleRequest(CONSTANTS.REQUEST_TYPE_REMOVE_GREENHOUSE);
                            closeDropdown();
                          }}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />Dejar invernadero
                          </div>
                        )}
                        {hasCollaborator && !hasCollaboratorRequest && (
                          <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => {
                            setShowRemoveCollaboratorModal(true);
                            closeDropdown();
                          }}>
                            <FontAwesomeIcon icon={faUserSlash} className="me-2" />Quitar colaborador
                          </div>
                        )}
                      </IfNotType>
                      <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => {
                        sendSimpleRequest(CONSTANTS.REQUEST_TYPE_UNREGISTER);
                        closeDropdown();
                      }}>
                        <FontAwesomeIcon icon={faUserSlash} className="me-2" />Darse de baja
                      </div>
                    </>
                  )}
                </AnimatedDropdown>
              </Card.Header>


              <Card.Body>
                <ListGroup variant="flush" className="border rounded-3">
                  <ListGroup.Item><FontAwesomeIcon icon={faUser} className="me-2" />Nombre: <strong>{identity.user.displayName}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI: <strong>{identity.metadata.dni}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email: <strong>{identity.account.email}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faPhone} className="me-2" />Teléfono: <strong>{identity.metadata.phone}</strong></ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faHashtag} className="me-2" />Socio Nº: <strong>{identity.metadata.memberNumber}</strong> | Huerto Nº: <strong>{identity.metadata.plotNumber}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faSeedling} className="me-2" />Tipo de socio: <strong>{['LISTA DE ESPERA', 'HORTELANO', 'HORTELANO + INVERNADERO', 'COLABORADOR', 'SUBVENCION', 'DESARROLLADOR'][identity.metadata.type]}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />Rol en huertos: <strong>{['USUARIO', 'ADMIN', 'DESARROLLADOR'][identity.metadata.role]}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />Estado: <strong>{identity.account.status === 1 ? 'ACTIVO' : 'INACTIVO'}</strong>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>


          <Col xs={12} md={7}>
            <h2 className='section-title'>Mis pagos</h2>
            <hr className="section-divider" />
            {incomes.length === 0 && <p className="text-center">No hay pagos registrados.</p>}
            <div className="d-flex flex-wrap gap-3 mb-4">
              {incomes.map(income => (
                <IngresoCard key={income.incomeId} income={income} editable={false} />
              ))}
            </div>

            <h2 className='section-title'>Mis solicitudes</h2>
            <hr className="section-divider" />
            {myRequests.length === 0 && <p className="text-center">No tienes solicitudes registradas.</p>}

            <div className="d-flex flex-wrap gap-3 mb-4">
              {mappedRequests.map(request => (
                <SolicitudCard key={request.requestId} data={request} editable={false} onProfile={true} />
              ))}
            </div>

            <h2 className='section-title'>Cambio de contraseña</h2>
            <hr className="section-divider" />
            <Form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="d-flex flex-column gap-3">
              <div className="d-flex flex-column gap-3">
                {/* Contraseña actual */}
                <FloatingLabel controlId="floatingPassword" label={<><FontAwesomeIcon icon={faUser} className="me-2" />Contraseña actual</>}>
                  <Form.Control
                    required
                    onChange={handleChange}
                    type={showOld ? "text" : "password"}
                    placeholder=""
                    name="oldPassword"
                    className="rounded-4"
                    isInvalid={!!fieldErrors?.oldPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("oldPassword")}
                  </Form.Control.Feedback>
                  <Button
                    variant="link"
                    className="show-button position-absolute end-0 top-50 translate-middle-y me-2"
                    onClick={() => setShowOld(!showOld)}
                    aria-label="Mostrar contraseña"
                    tabIndex={-1}
                    style={{ zIndex: 2 }}
                  >
                    <FontAwesomeIcon icon={showOld ? faEyeSlash : faEye} className='fa-lg' />
                  </Button>
                </FloatingLabel>

                {/* Nueva contraseña */}
                <FloatingLabel controlId="floatingNewPassword" label={<><FontAwesomeIcon icon={faUser} className="me-2" />Nueva contraseña</>}>
                  <Form.Control
                    required
                    onChange={handleChange}
                    type={showNew ? "text" : "password"}
                    placeholder=""
                    name="newPassword"
                    className="rounded-4"
                    isInvalid={!!fieldErrors?.newPassword}
                  />
                  <Form.Control.Feedback type="invalid" as="span">
                    {getFieldError("newPassword")}
                  </Form.Control.Feedback>
                  <Button
                    variant="link"
                    className="show-button position-absolute end-0 top-50 translate-middle-y me-2"
                    onClick={() => setShowNew(!showNew)}
                    aria-label="Mostrar contraseña"
                    tabIndex={-1}
                    style={{ zIndex: 2 }}
                  >
                    <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} className='fa-lg' />
                  </Button>
                </FloatingLabel>

                {/* Confirmar nueva contraseña */}
                <FloatingLabel controlId="floatingConfirmPassword" label={<><FontAwesomeIcon icon={faUser} className="me-2" />Confirmar nueva contraseña</>}>
                  <Form.Control
                    required
                    onChange={handleChange}
                    type={showConfirm ? "text" : "password"}
                    placeholder=""
                    name="confirmNewPassword"
                    className="rounded-4"
                  />
                  <Button
                    variant="link"
                    className="show-button position-absolute end-0 top-50 translate-middle-y me-2"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Mostrar contraseña"
                    tabIndex={-1}
                    style={{ zIndex: 2 }}
                  >
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className='fa-lg' />
                  </Button>
                </FloatingLabel>
              </div>
              <Button
                disabled={newPasswordData.newPassword !== newPasswordData.confirmNewPassword ||
                  newPasswordData.newPassword === '' || newPasswordData.confirmNewPassword === '' ||
                  newPasswordData.oldPassword === ''
                }
                type='submit'
                variant="warning"
                style={{ width: 'fit-content' }}
                className='rounded-4'
              >
                <FontAwesomeIcon icon={faKey} className="me-2" />  Cambiar contraseña
              </Button>
            </Form>
          </Col>
        </Row>

        <CustomModal
          title="Añadir colaborador"
          show={showAddCollaboratorModal}
          onClose={() => {
            setShowAddCollaboratorModal(false);
            setFieldErrors(null);
          }}
        >
          <NewUserForm
            userType={3}
            plotNumber={identity.metadata.plotNumber}
            fieldErrors={fieldErrors}
            onSubmit={async (formData) => {
              try {
                setFieldErrors(null);

                await postData(config.requestUrl, {
                  type: CONSTANTS.REQUEST_TYPE_ADD_COLLABORATOR,
                  status: CONSTANTS.REQUEST_PENDING,
                  userId: identity.user.userId,
                  name: identity.user.displayName,
                  metadata: {
                    displayName: formData.displayName,
                    username: formData.username,
                    dni: formData.dni,
                    phone: formData.phone,
                    email: formData.email,
                    memberNumber: formData.memberNumber,
                    plotNumber: formData.plotNumber,
                    type: formData.type
                  }
                });

                setShowAddCollaboratorModal(false);
                setFeedbackModal({
                  title: 'Solicitud enviada',
                  message: 'El colaborador ha sido solicitado correctamente.',
                  variant: 'success',
                  onClick: closeFeedback
                });

              } catch (err) {
                if (err?.status === 422 && err?.errors) {
                  setFieldErrors(err.errors);
                }
              }
            }}
          />
        </CustomModal>


        <CustomModal
          title="Eliminar colaborador"
          show={showRemoveCollaboratorModal}
          onClose={() => setShowRemoveCollaboratorModal(false)}
        >
          <p className=' p-3'>¿Estás seguro de que quieres eliminar tu colaborador actual?</p>
          <div className="d-flex justify-content-end gap-2 mt-3 p-3">
            <Button variant="secondary" onClick={() => setShowRemoveCollaboratorModal(false)}>Cancelar</Button>
            <Button
              variant="warning"
              onClick={async () => {
                try {
                  sendSimpleRequest(CONSTANTS.REQUEST_TYPE_REMOVE_COLLABORATOR);
                  setFeedbackModal({
                    title: "Solicitud enviada",
                    message: "Se ha solicitado la eliminación del colaborador.",
                    variant: "success",
                    onClick: closeFeedback
                  });
                  setShowRemoveCollaboratorModal(false);
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              Confirmar
            </Button>
          </div>
        </CustomModal>

        {feedbackModal && (
          <NotificationModal
            show={true}
            onClose={closeFeedback}
            title={feedbackModal.title}
            message={feedbackModal.message}
            variant={feedbackModal.variant}
            buttons={[{ label: "Aceptar", variant: feedbackModal.variant, onClick: feedbackModal.onClick }]}
          />
        )}

      </ContentWrapper>
    </CustomContainer>
  );
};

export default Perfil;

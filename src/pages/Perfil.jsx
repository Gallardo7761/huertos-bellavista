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
import PreUserForm from '../components/Solicitudes/PreUserForm';
import NotificationModal from '../components/NotificationModal';
import { Button, Col, Row } from 'react-bootstrap';
import AnimatedDropdown from '../components/AnimatedDropdown';
import { useAuth } from '../hooks/useAuth';
import { CONSTANTS } from '../util/constants';

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
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.members.profile}`,
    myIncomesUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.incomes.myIncomes),
    requestUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.requests.all),
    preUsersUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.pre_users.all),
    preUserValidationUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.pre_users.validation),
    myRequestsUrl: buildUrl(config.apiConfig.baseUrl, config.apiConfig.endpoints.requests.myRequests),
    changePasswordUrl: buildUrl(config.apiConfig.coreUrl, config.apiConfig.endpoints.auth.changePassword),
    loginValidateUrl: buildUrl(config.apiConfig.coreUrl, config.apiConfig.endpoints.auth.loginValidate),
  };

  return (
    <DataProvider config={reqConfig}>
      <PerfilContent config={reqConfig} />
    </DataProvider>
  );
};

const PerfilContent = ({ config }) => {
  const { data, dataLoading, dataError, postData, postDataValidated } = useDataContext();
  const { logout } = useAuth();

  const usuario = data?.member;
  const myRequests = data?.requests ?? [];
  const incomes = data?.payments ?? [];
  const hasCollaborator = data?.hasCollaborator ?? false;
  const hasCollaboratorRequest = data?.hasCollaboratorRequest ?? false;
  const hasGreenHouse = data?.hasGreenHouse ?? false;
  const hasGreenHouseRequest = data?.hasGreenHouseRequest ?? false;

  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState(false);
  const [showRemoveCollaboratorModal, setShowRemoveCollaboratorModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const closeFeedback = () => setFeedbackModal(null);

  const [validationErrors, setValidationErrors] = useState({});

  const [newPasswordData, setNewPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestUnregister = async () => {
    try {
      await postData(config.requestUrl, {
        type: CONSTANTS.REQUEST_TYPE_UNREGISTER,
        status: CONSTANTS.REQUEST_PENDING,
        requested_by: usuario.user_id
      });
      setFeedbackModal({
        title: 'Solicitud enviada',
        message: 'Se ha enviado la solicitud de baja correctamente.',
        variant: 'success',
        onClick: closeFeedback
      });
    } catch (err) {
      setFeedbackModal({
        title: 'Error',
        message: err.message,
        variant: 'danger',
        onClick: closeFeedback
      });
    }
  };

  const handleRequestGreenHouse = async () => {
    try {
      await postData(config.requestUrl, {
        type: CONSTANTS.REQUEST_TYPE_ADD_GREENHOUSE,
        status: CONSTANTS.REQUEST_PENDING,
        requested_by: usuario.user_id
      });
      setFeedbackModal({
        title: 'Solicitud enviada',
        message: 'Se ha enviado la solicitud de invernadero correctamente.',
        variant: 'success',
        onClick: closeFeedback
      });
    } catch (err) {
      setFeedbackModal({
        title: 'Error',
        message: err.message,
        variant: 'danger',
        onClick: closeFeedback
      });
    }
  };

  const handleRemoveGreenHouse = async () => {
    try {
      await postData(config.requestUrl, {
        type: CONSTANTS.REQUEST_TYPE_REMOVE_GREENHOUSE,
        status: CONSTANTS.REQUEST_PENDING,
        requested_by: usuario.user_id
      });
      setFeedbackModal({
        title: 'Solicitud enviada',
        message: 'Se ha enviado la solicitud de baja de invernadero correctamente.',
        variant: 'success',
        onClick: closeFeedback
      });
    } catch (err) {
      setFeedbackModal({
        title: 'Error',
        message: err.message,
        variant: 'danger',
        onClick: closeFeedback
      });
    }
  };

  const handleChange = (e) => {
    setNewPasswordData({
      ...newPasswordData,
      [e.target.name]: e.target.value
    });
  }

  const handleChangePassword = async () => {
    try {
      const validOldPassword = await postData(config.loginValidateUrl, {
        userId: usuario.user_id,
        password: newPasswordData.currentPassword
      });
      if (!validOldPassword.valid) throw new Error("La contraseña actual es incorrecta.");
      if (newPasswordData.newPassword !== newPasswordData.confirmNewPassword) throw new Error("Las contraseñas no coinciden.");
      if (newPasswordData.newPassword.length < 8) throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");

      const response = await postData(config.changePasswordUrl, {
        userId: usuario.user_id,
        newPassword: newPasswordData.newPassword
      });

      if (!response) throw new Error("Error al cambiar la contraseña.");
      setNewPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
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
      setFeedbackModal({
        title: 'Error',
        message: err.message,
        variant: 'danger',
        onClick: closeFeedback
      });
    }
  }

  const mappedRequests = myRequests.map(r => ({
    ...r,
    request_type: r.request_type ?? r.type,
    request_status: r.request_status ?? r.status,
    request_created_at: r.request_created_at ?? r.created_at
  }));

  if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
  if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

  return (
    <CustomContainer>
      <ContentWrapper>
        <Row className='gap-2 justify-content-center'>
          <Col xs={12} md={4} className="mb-4">
            <Card className="shadow-sm rounded-4 perfil-card">
              <Card.Header className="bg-secondary text-white rounded-top-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={getPFP(usuario.type)} alt="PFP" width={36} className="me-3" />
                  <div className="m-0 p-0">
                    <Card.Title className="mb-0">{`@${usuario.user_name}`}</Card.Title>
                    <small>Te uniste el {parseDate(usuario.created_at)}</small>
                  </div>
                </div>

                <AnimatedDropdown
                  className="end-0"
                  buttonStyle="card-button"
                  icon={<FontAwesomeIcon icon={faCog} className="fa-xl" />}
                >
                  {({ closeDropdown }) => (
                    <>
                      {!hasGreenHouse && !hasGreenHouseRequest && (
                        <div className="dropdown-item d-flex align-items-center" onClick={() => { handleRequestGreenHouse(); closeDropdown(); }}>
                          <FontAwesomeIcon icon={faSeedling} className="me-2" />Solicitar invernadero
                        </div>
                      )}
                      {!hasCollaborator && !hasCollaboratorRequest && (
                        <div className="dropdown-item d-flex align-items-center" onClick={() => { setShowAddCollaboratorModal(true); closeDropdown(); }}>
                          <FontAwesomeIcon icon={faUserPlus} className="me-2" />Añadir un colaborador
                        </div>
                      )}
                      <hr className="dropdown-divider" />
                      {hasGreenHouse && !hasGreenHouseRequest && (
                        <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleRemoveGreenHouse(); closeDropdown(); }}>
                          <FontAwesomeIcon icon={faArrowRightFromBracket} className="me-2" />Dejar invernadero
                        </div>
                      )}
                      {hasCollaborator && !hasCollaboratorRequest && (
                        <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { setShowRemoveCollaboratorModal(true); closeDropdown(); }}>
                          <FontAwesomeIcon icon={faUserSlash} className="me-2" />Quitar colaborador
                        </div>
                      )}
                      <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleRequestUnregister(); closeDropdown(); }}>
                        <FontAwesomeIcon icon={faUserSlash} className="me-2" />Darse de baja
                      </div>
                    </>
                  )}
                </AnimatedDropdown>
              </Card.Header>


              <Card.Body>
                <ListGroup variant="flush" className="border rounded-3">
                  <ListGroup.Item><FontAwesomeIcon icon={faUser} className="me-2" />Nombre: <strong>{usuario.display_name}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI: <strong>{usuario.dni}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email: <strong>{usuario.email}</strong></ListGroup.Item>
                  <ListGroup.Item><FontAwesomeIcon icon={faPhone} className="me-2" />Teléfono: <strong>{usuario.phone}</strong></ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faHashtag} className="me-2" />Socio Nº: <strong>{usuario.member_number}</strong> | Huerto Nº: <strong>{usuario.plot_number}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faSeedling} className="me-2" />Tipo de socio: <strong>{['LISTA DE ESPERA', 'HORTELANO', 'HORTELANO + INVERNADERO', 'COLABORADOR', 'SUBVENCION', 'DESARROLLADOR'][usuario.type]}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />Rol en huertos: <strong>{['USUARIO', 'ADMIN', 'DESARROLLADOR'][usuario.role]}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />Estado: <strong>{usuario.status === 1 ? 'ACTIVO' : 'INACTIVO'}</strong>
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
                <IngresoCard key={income.income_id} income={income} editable={false} />
              ))}
            </div>

            <h2 className='section-title'>Mis solicitudes</h2>
            <hr className="section-divider" />
            {myRequests.length === 0 && <p className="text-center">No tienes solicitudes registradas.</p>}

            <div className="d-flex flex-wrap gap-3 mb-4">
              {mappedRequests.map(request => (
                <SolicitudCard key={request.request_id} data={request} editable={false} onProfile={true} />
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
                    name="currentPassword"
                    className="rounded-4"
                  />
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
                  />
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
                  newPasswordData.currentPassword === ''
                }
                onClick={(e) => { e.preventDefault(); handleChangePassword(); }}
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
            setValidationErrors({});
          }}
        >
          <PreUserForm
            userType={3}
            plotNumber={usuario.plot_number}
            errors={validationErrors}
            onSubmit={async (formData) => {
              setValidationErrors({});

              const { _, errors } = await postDataValidated(config.preUserValidationUrl, formData);
              if (errors) {
                setValidationErrors(errors);
                return;
              }

              try {
                const request = await postData(config.requestUrl, {
                  type: CONSTANTS.REQUEST_TYPE_ADD_COLLABORATOR,
                  status: CONSTANTS.REQUEST_PENDING,
                  requested_by: usuario.user_id
                });

                const requestId = request?.request_id;
                if (!requestId) throw new Error("No se pudo crear la solicitud.");

                await postData(config.preUsersUrl, {
                  ...formData,
                  request_id: requestId
                });

                setValidationErrors({});
                setShowAddCollaboratorModal(false);
                setFeedbackModal({
                  title: "Colaborador añadido",
                  message: "Tu solicitud de colaborador ha sido enviada correctamente.",
                  variant: "success",
                  onClick: closeFeedback
                });
              } catch (err) {
                setValidationErrors({});
                setFeedbackModal({
                  title: "Error",
                  message: err.message,
                  variant: "danger",
                  onClick: closeFeedback
                });
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
                  await postData(config.requestUrl, {
                    type: CONSTANTS.REQUEST_TYPE_REMOVE_COLLABORATOR,
                    status: CONSTANTS.REQUEST_PENDING,
                    requested_by: usuario.user_id
                  });

                  setFeedbackModal({
                    title: "Solicitud enviada",
                    message: "Se ha solicitado la eliminación del colaborador.",
                    variant: "success",
                    onClick: closeFeedback
                  });
                  setShowRemoveCollaboratorModal(false);
                } catch (err) {
                  setFeedbackModal({
                    title: "Error",
                    message: err.message,
                    variant: "danger",
                    onClick: closeFeedback
                  });
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

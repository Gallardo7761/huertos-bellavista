import { Card, ListGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faIdCard, faEnvelope, faPhone, faHome, faMapMarkerAlt, faHashtag,
  faSeedling, faUserShield, faCalendar,
  faTrash, faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { motion as _motion } from 'framer-motion';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import '../../css/SolicitudCard.css';

const MotionCard = _motion.create(Card);

const parseDate = (date) => {
  if (!date) return 'NO';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const getTipoSolicitud = (tipo) => ['Alta', 'Baja', 'Añadir Colaborador', 'Quitar Colaborador', 'Añadir parcela invernadero', 'Dejar parcela invernadero'][tipo] ?? 'Desconocido';
const getEstadoSolicitud = (estado) => ['Pendiente', 'Aceptada', 'Rechazada'][estado] ?? 'Desconocido';

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

const renderDescripcionSolicitud = (data, onProfile) => {
  const { request_type, request_status, requested_by_name, pre_display_name } = data;

  switch (request_type) {
    case 0:
      if (requested_by_name) {
        return `${requested_by_name} quiere darse de alta.`;
      } else if(pre_display_name) {
        return `${pre_display_name} quiere darse de alta.`
      } else {
        return `Se ha aceptado esta solicitud de alta`;
      }
    case 1:
      return onProfile
        ? "Has solicitado darte de baja."
        : `${requested_by_name} quiere darse de baja.`;
    case 2:
      if (onProfile) {
        switch (request_status) {
          case 0: return "Has solicitado añadir un colaborador.";
          case 1: return "Tu solicitud de colaborador ha sido aceptada.";
          case 2: return "Tu solicitud de colaborador ha sido rechazada.";
          default: return "Solicitud de colaborador desconocida.";
        }
      } else {
        switch (request_status) {
          case 0: return `${requested_by_name} quiere añadir a ${pre_display_name} como colaborador.`;
          case 1: return `La solicitud de colaborador de ${requested_by_name} ha sido aceptada.`;
          case 2: return `La solicitud de colaborador de ${requested_by_name} ha sido rechazada.`;
          default: return "Solicitud de colaborador desconocida.";
        }
      }
    case 3:
      return onProfile
        ? "Has solicitado quitar tu colaborador."
        : `${requested_by_name} quiere quitar su colaborador.`;
    case 4:
      return onProfile
        ? "Has solicitado una parcela en el invernadero."
        : `${requested_by_name} quiere una parcela en el invernadero.`;
    case 5:
      return onProfile
        ? "Has solicitado dejar tu parcela del invernadero."
        : `${requested_by_name} quiere dejar su parcela del invernadero.`;
    default:
      return "Tipo de solicitud desconocido.";
  }
};

const SolicitudCard = ({ data, onAccept, onReject, onDelete, editable = true, onProfile = false }) => {
  const handleDelete = () => typeof onDelete === "function" && onDelete(data.request_id);

  return (
    <MotionCard className="solicitud-card shadow-sm rounded-4 h-100">
      <Card.Header className="rounded-top-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={getPFP(data.pre_type)} width="36" className="rounded me-3" alt="PFP" />
          <div>
            <Card.Title className="mb-0">
              Solicitud #{data.request_id} - {getTipoSolicitud(data.request_type)}
            </Card.Title>
            <small className='state-small'>Estado: <strong>{getEstadoSolicitud(data.request_status)}</strong></small>
          </div>
        </div>

        {!onProfile && (
          <AnimatedDropdown
            className="end-0"
            buttonStyle="card-button"
            icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}>
            {({ closeDropdown }) => (
              <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleDelete(); closeDropdown(); }}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />Eliminar
              </div>
            )}
          </AnimatedDropdown>
        )}
      </Card.Header>

      <Card.Body>
        <ListGroup variant="flush" className="border rounded-3 mb-3">
          <ListGroup.Item>
            <FontAwesomeIcon icon={faCalendar} className="me-2" />
            Fecha de solicitud: <strong>{parseDate(data.request_created_at)}</strong>
          </ListGroup.Item>
        </ListGroup>

        <ListGroup variant="flush" className="border rounded-3 mb-3">
          <ListGroup.Item>
            {renderDescripcionSolicitud(data, onProfile)}
          </ListGroup.Item>
        </ListGroup>

        {data.pre_display_name && (
          <>
            <Card.Subtitle className="card-subtitle mt-3 mb-2">Datos del futuro socio</Card.Subtitle>
            <ListGroup variant="flush" className="border rounded-3">
              <ListGroup.Item><FontAwesomeIcon icon={faUser} className="me-2" />Nombre: <strong>{data.pre_display_name}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI: <strong>{data.pre_dni}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faPhone} className="me-2" />Teléfono: <strong>{data.pre_phone}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faEnvelope} className="me-2" />Email: <strong>{data.pre_email}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faHome} className="me-2" />Dirección: <strong>{data.pre_address ?? 'NO'}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Ciudad: <strong>{data.pre_city ?? 'NO'} ({data.pre_zip_code ?? 'NO'})</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faHashtag} className="me-2" />Nº socio: <strong>{data.pre_member_number ?? 'NO'}</strong> | Nº huerto: <strong>{data.pre_plot_number ?? 'NO'}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faSeedling} className="me-2" />Tipo: <strong>{['Lista de Espera', 'Hortelano', 'Hortelano + Invernadero', 'Colaborador'][data.pre_type]}</strong></ListGroup.Item>
              <ListGroup.Item><FontAwesomeIcon icon={faUserShield} className="me-2" />Rol: <strong>{['Usuario', 'Admin', 'Desarrollador'][data.pre_role]}</strong></ListGroup.Item>
            </ListGroup>
          </>
        )}

        {editable && data.request_status === 0 && (
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="danger" size="sm" onClick={() => onReject?.(data)}>Rechazar</Button>
            <Button variant="success" size="sm" onClick={() => onAccept?.(data)}>Aceptar</Button>
          </div>
        )}
      </Card.Body>
    </MotionCard>
  );
};

SolicitudCard.propTypes = {
  data: PropTypes.object.isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onDelete: PropTypes.func,
  editable: PropTypes.bool,
  onProfile: PropTypes.bool
};

export default SolicitudCard;
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
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const getTipoSolicitud = (tipo) =>
  ['Alta', 'Baja', 'Añadir Colaborador', 'Quitar Colaborador', 'Añadir parcela invernadero', 'Dejar parcela invernadero'][tipo]
  ?? 'Desconocido';

const getEstadoSolicitud = (estado) =>
  ['Pendiente', 'Aceptada', 'Rechazada'][estado] ?? 'Desconocido';

const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    0: 'list.svg',
    1: 'farmer.svg',
    2: 'green_house.svg',
    3: 'join.svg'
  };
  return base + (map[tipo] || 'farmer.svg');
};

const renderDescripcionSolicitud = (data, onProfile) => {
  const m = data.metadata;

  if (onProfile) {
    switch (data.type) {
      case 0: // Alta
        return data.status === 1
          ? 'Te han dado de alta correctamente.'
          : 'Has solicitado darte de alta.';

      case 1: // Baja
        return data.status === 1
          ? 'Tu baja ha sido procesada.'
          : 'Has solicitado darte de baja.';

      case 2: // Añadir colaborador
        return data.status === 1
          ? 'Tu solicitud de añadir colaborador ha sido aceptada.'
          : data.status === 2
          ? 'Tu solicitud de añadir colaborador ha sido rechazada.'
          : 'Has solicitado añadir un colaborador.';

      case 3: // Quitar colaborador
        return data.status === 1
          ? 'Tu solicitud de quitar colaborador ha sido aceptada.'
          : data.status === 2
          ? 'Tu solicitud de quitar colaborador ha sido rechazada.'
          : 'Has solicitado quitar tu colaborador.';

      case 4: // Añadir parcela invernadero
        return data.status === 1
          ? 'Tu solicitud de añadir parcela en invernadero ha sido aceptada.'
          : data.status === 2
          ? 'Tu solicitud de añadir parcela en invernadero ha sido rechazada.'
          : 'Has solicitado añadir una parcela en invernadero.';

      case 5: // Dejar parcela invernadero
        return data.status === 1
          ? 'Tu solicitud de dejar la parcela en invernadero ha sido aceptada.'
          : data.status === 2
          ? 'Tu solicitud de dejar la parcela en invernadero ha sido rechazada.'
          : 'Has solicitado dejar tu parcela en invernadero.';

      default:
        return 'Solicitud desconocida.';
    }
  } else {
    // Para administradores o vista general
    switch (data.type) {
      case 0:
        return data.status === 1
          ? `Se ha aceptado la solicitud de alta de ${m?.displayName ?? data.name}.`
          : `${m?.displayName ?? data.name} quiere darse de alta.`;

      case 1:
        return data.status === 1
          ? `Se ha procesado la baja de ${m?.displayName ?? data.name}.`
          : `${m?.displayName ?? data.name} quiere darse de baja.`;

      case 2:
        return data.status === 1
          ? `La solicitud de añadir colaborador de ${data.name} ha sido aceptada.`
          : data.status === 2
          ? `La solicitud de añadir colaborador de ${data.name} ha sido rechazada.`
          : `${data.name} quiere añadir un colaborador.`;

      case 3:
        return data.status === 1
          ? `La solicitud de quitar colaborador de ${m?.displayName ?? data.name} ha sido aceptada.`
          : data.status === 2
          ? `La solicitud de quitar colaborador de ${m?.displayName ?? data.name} ha sido rechazada.`
          : `${m?.displayName ?? data.name} quiere quitar su colaborador.`;

      case 4:
        return data.status === 1
          ? `La solicitud de añadir parcela de ${m?.displayName ?? data.name} ha sido aceptada.`
          : data.status === 2
          ? `La solicitud de añadir parcela de ${m?.displayName ?? data.name} ha sido rechazada.`
          : `${m?.displayName ?? data.name} quiere una parcela en invernadero.`;

      case 5:
        return data.status === 1
          ? `La solicitud de dejar parcela de ${m?.displayName ?? data.name} ha sido aceptada.`
          : data.status === 2
          ? `La solicitud de dejar parcela de ${m?.displayName ?? data.name} ha sido rechazada.`
          : `${m?.displayName ?? data.name} quiere dejar su parcela del invernadero.`;

      default:
        return 'Tipo de solicitud desconocido.';
    }
  }
};

const SolicitudCard = ({
  data,
  onAccept,
  onReject,
  onDelete,
  editable = true,
  onProfile = false
}) => {
  const m = data.metadata;

  const handleDelete = () =>
    typeof onDelete === 'function' && onDelete(data.requestId);

  return (
    <MotionCard className="solicitud-card shadow-sm rounded-4 h-100">
      <Card.Header className="rounded-top-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={getPFP(m?.type)}
            width="36"
            className="rounded me-3"
            alt="PFP"
          />
          <div>
            <Card.Title className="mb-0">
              Solicitud #{data.requestId?.slice(0, 8)} – {getTipoSolicitud(data.type)}
            </Card.Title>
            <small className="state-small">
              Estado: <strong>{getEstadoSolicitud(data.status)}</strong>
            </small>
          </div>
        </div>

        {!onProfile && (
          <AnimatedDropdown
            className="end-0"
            buttonStyle="card-button"
            icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}
          >
            {({ closeDropdown }) => (
              <div
                className="dropdown-item d-flex align-items-center text-danger"
                onClick={() => {
                  handleDelete();
                  closeDropdown();
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Eliminar
              </div>
            )}
          </AnimatedDropdown>
        )}
      </Card.Header>

      <Card.Body>
        <ListGroup variant="flush" className="border rounded-3 mb-3">
          <ListGroup.Item>
            <FontAwesomeIcon icon={faCalendar} className="me-2" />
            Fecha de solicitud: <strong>{parseDate(data.createdAt)}</strong>
          </ListGroup.Item>
        </ListGroup>

        <ListGroup variant="flush" className="border rounded-3 mb-3">
          <ListGroup.Item>
            {renderDescripcionSolicitud(data, onProfile)}
          </ListGroup.Item>
        </ListGroup>

        {m && !onProfile && (
          <>
            <Card.Subtitle className="card-subtitle mt-3 mb-2">
              Datos asociados a la solicitud
            </Card.Subtitle>

            <ListGroup variant="flush" className="border rounded-3">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Nombre: <strong>{m.displayName}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faIdCard} className="me-2" />
                DNI: <strong>{m.dni}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                Teléfono: <strong>{m.phone ?? 'NO'}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Email: <strong>{m.email}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faUserShield} className="me-2" />
                Usuario: <strong>{m.username}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Dirección: <strong>{m.address ?? 'NO'}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                Ciudad:{' '}
                <strong>
                  {m.city ?? 'NO'} ({m.zipCode ?? 'NO'})
                </strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faHashtag} className="me-2" />
                Nº socio: <strong>{m.memberNumber ?? 'NO'}</strong> | Nº huerto:{' '}
                <strong>{m.plotNumber ?? 'NO'}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                <FontAwesomeIcon icon={faSeedling} className="me-2" />
                Tipo: <strong>{['Lista de espera', 'Hortelano', 'Hortelano + Invernadero', 'Colaborador', 'Subvenciones', 'Desarrollador'][m.type]}</strong>
              </ListGroup.Item>
            </ListGroup>
          </>
        )}

        {editable && data.status === 0 && (
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="danger" size="sm" onClick={() => onReject?.(data)}>
              Rechazar
            </Button>
            <Button variant="success" size="sm" onClick={() => onAccept?.(data)}>
              Aceptar
            </Button>
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

import { useState } from 'react';
import {
  Card, ListGroup, Badge, Button, Form
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard, faUser, faSunPlantWilt, faPhone, faClipboard, faAt,
  faEllipsisVertical, faEdit, faTrash, faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import '../../css/SocioCard.css';

const getFechas = (socio) => {
  let html = `<strong>ALTA:</strong> ${parseDate(socio.fechaDeAlta)}`;
  if (socio.fechaDeEntrega) html += `, <strong>ENTREGA:</strong> ${parseDate(socio.fechaDeEntrega)}`;
  if (socio.fechaDeBaja) html += `, <strong>BAJA:</strong> ${parseDate(socio.fechaDeBaja)}`;
  return html;
};
const getBadgeColor = (estado) => estado === 1 ? 'success' : 'danger';
const getHeaderColor = (estado) => estado === 1 ? 'bg-light-green' : 'bg-light-red';
const getEstado = (estado) => estado === 1 ? 'ACTIVO' : 'INACTIVO';
const parseNull = (attr) => attr === null || attr === '' ? 'NO' : attr;
const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    HORTELANO: 'farmer.png',
    HORTELANO_INVERNADERO: 'green_house.png',
    LISTA_ESPERA: 'list.png',
    COLABORADOR: 'join.png',
    SUBVENCIONES: 'subvencion4.png',
    DESARROLLADOR: 'programmer.png'
  };
  return base + (map[tipo] || 'farmer.png');
};
const parseDate = (date) => {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

const MotionCard = _motion.create(Card);

const SocioCard = ({ socio, isNew = false, onCreate, onUpdate, onDelete, onCancel }) => {
  const createMode = isNew;
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(isNew);
  const [formData, setFormData] = useState({
    idSocio: socio.idSocio || null,
    nombre: socio.nombre || '',
    usuario: socio.usuario || '',
    dni: socio.dni || '',
    telefono: socio.telefono || '',
    email: socio.email || '',
    notas: socio.notas || '',
    numeroSocio: socio.numeroSocio || '',
    numeroHuerto: socio.numeroHuerto || '',
    estado: socio.estado,
    tipo: socio.tipo || "HORTELANO",
    fechaDeAlta: socio.fechaDeAlta || new Date().toISOString().split("T")[0],
  });

  const handleEdit = () => setEditMode(true);
  const handleDelete = () => typeof onDelete === "function" && onDelete(socio.idSocio);
  const handleCancel = () => {
    if (isNew && onCancel) return onCancel();
    setEditMode(false);
    if (error) setError(null);
    setFormData({ telefono: socio.telefono || '', email: socio.email || '', notas: socio.notas || '', estado: socio.estado });
  };

  const handleSave = () => {
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.telefono)) return setError("El teléfono no es válido.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) return setError("El email no es válido.");
    if (!formData.nombre.trim() || !formData.numeroSocio) return setError("El nombre y número de socio son obligatorios.");
    setError(null);
    if (createMode && typeof onCreate === "function") {
      const fullSocio = {
        idSocio: null,
        nombre: formData.nombre,
        usuario: formData.nombre.toLowerCase().replace(/\s+/g, '') + formData.numeroSocio,
        dni: formData.dni,
        telefono: formData.telefono,
        email: formData.email,
        notas: formData.notas,
        numeroSocio: formData.numeroSocio,
        numeroHuerto: formData.numeroHuerto,
        estado: formData.estado,
        tipo: socio.tipo || "HORTELANO",
        fechaDeAlta: socio.fechaDeAlta || new Date().toISOString().split("T")[0],
      };
      return onCreate(fullSocio);
    }
    if (typeof onUpdate === "function") {
      onUpdate(formData, socio.idSocio);
      setEditMode(false);
    }
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <MotionCard className="socio-card shadow-sm rounded-4 border-0 h-100">
      <Card.Header className={`d-flex align-items-center rounded-4 rounded-bottom-0 justify-content-between ${getHeaderColor(socio.estado)}`}>
        <div className="d-flex align-items-center p-1 m-0">
          <img src={getPFP(socio.tipo)} width="36" className="rounded me-3" alt="PFP" />
          <div>
            <Card.Title className="m-0">
              {(editMode || createMode) ? (
                <Form.Control size="sm" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} placeholder="Nombre" style={{ maxWidth: '220px' }} />
              ) : socio.nombre}
            </Card.Title>
            {editMode ? (
              <Form.Select size="sm" value={formData.estado} onChange={(e) => handleChange('estado', parseInt(e.target.value))} style={{ maxWidth: '8rem' }}>
                <option value={1}>ACTIVO</option>
                <option value={0}>INACTIVO</option>
              </Form.Select>
            ) : (
              <Badge bg={getBadgeColor(socio.estado)}>{getEstado(socio.estado)}</Badge>
            )}
          </div>
        </div>

        {!createMode && (
          <AnimatedDropdown icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl text-dark" />}>
            {({ closeDropdown }) => (
              <>
                <div className="dropdown-item d-flex align-items-center" onClick={() => { handleEdit(); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                </div>
                <div className="dropdown-item d-flex align-items-center" onClick={closeDropdown}>
                  <FontAwesomeIcon icon={faMoneyBill} className="me-2" />Ver ingresos
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleDelete(); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />Eliminar
                </div>
              </>
            )}
          </AnimatedDropdown>
        )}
      </Card.Header>

      <Card.Body>
        {error && <div className="alert alert-danger py-1 px-2 small" role="alert">{error}</div>}

        <Card.Text as="div">
          <small dangerouslySetInnerHTML={{ __html: getFechas(socio) }} />
        </Card.Text>

        <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
          {[{
            label: 'DNI', icon: faIdCard, value: formData.dni, field: 'dni', type: 'text', maxWidth: '180px'
          }, {
            label: 'SOCIO Nº', icon: faUser, value: formData.numeroSocio, field: 'numeroSocio', type: 'number', maxWidth: '100px'
          }, {
            label: 'HUERTO Nº', icon: faSunPlantWilt, value: formData.numeroHuerto, field: 'numeroHuerto', type: 'number', maxWidth: '100px'
          }, {
            label: 'TLF.', icon: faPhone, value: formData.telefono, field: 'telefono', type: 'text', maxWidth: '200px'
          }, {
            label: 'EMAIL', icon: faAt, value: formData.email, field: 'email', type: 'text', maxWidth: '250px'
          }].map(({ label, icon, value, field, type, maxWidth }) => (
            <ListGroup.Item key={field} className="d-flex justify-content-between align-items-center">
              <span><FontAwesomeIcon icon={icon} className="me-2" />{label}</span>
              {(editMode || createMode) ? (
                <Form.Control size="sm" type={type} value={value} onChange={(e) => handleChange(field, e.target.value)} style={{ maxWidth }} />
              ) : (
                <strong>{parseNull(socio[field])}</strong>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Card className="mt-3 border-1 rounded-3 shadow-sm">
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              <FontAwesomeIcon icon={faClipboard} className="me-2" />NOTAS
            </Card.Subtitle>
            {editMode ? (
              <Form.Control as="textarea" rows={3} value={formData.notas} onChange={(e) => handleChange('notas', e.target.value)} />
            ) : (
              <Card.Text>{parseNull(socio.notas)}</Card.Text>
            )}
          </Card.Body>
        </Card>

        {editMode && (
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
            <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
          </div>
        )}
      </Card.Body>
    </MotionCard>
  );
};

SocioCard.propTypes = {
  socio: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  onCancelCreate: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
};

export default SocioCard;
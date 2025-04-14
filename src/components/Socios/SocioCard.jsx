import { useState } from 'react';
import {
  Card, ListGroup, Badge, Button, Form
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard, faUser, faSunPlantWilt, faPhone, faClipboard, faAt,
  faEllipsisVertical, faEdit, faTrash, faMoneyBill,
  faCheck,
  faXmark,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import '../../css/SocioCard.css';
import TipoSocioDropdown from './TipoSocioDropdown';

const getFechas = (formData, editMode, handleChange) => {
  const { created_at, assigned_at, deactivated_at } = formData;

  if (!editMode && !created_at && !assigned_at && !deactivated_at) return null;

  return (
    <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />ALTA</span>
        {editMode ? (
          <Form.Control
            type="date"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={created_at}
            onChange={(e) => handleChange('created_at', e.target.value)}
          />
        ) : (
          <strong>{parseDate(created_at)}</strong>
        )}
      </ListGroup.Item>

      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />ENTREGA</span>
        {editMode ? (
          <Form.Control
            type="date"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={assigned_at}
            onChange={(e) => handleChange('assigned_at', e.target.value)}
          />
        ) : (
          <strong>{parseDate(assigned_at)}</strong>
        )}
      </ListGroup.Item>

      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />BAJA</span>
        {editMode ? (
          <Form.Control
            type="date"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={deactivated_at}
            onChange={(e) => handleChange('deactivated_at', e.target.value)}
          />
        ) : (
          <strong>{parseDate(deactivated_at)}</strong>
        )}
      </ListGroup.Item>
    </ListGroup>
  );
};

const getBadgeColor = (estado) => estado === 1 ? 'success' : 'danger';
const getHeaderColor = (estado) => estado === 1 ? 'bg-light-green' : 'bg-light-red';
const getEstado = (estado) =>
  estado === 1 ? (
    <>
      <FontAwesomeIcon icon={faCheck} className="me-2" />
      ACTIVO
    </>
  ) : (
    <>
      <FontAwesomeIcon icon={faXmark} className="me-2" />
      INACTIVO
    </>
  );

const parseNull = (attr) => attr === null || attr === '' ? 'NO' : attr;
const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    1: 'farmer.png',
    2: 'green_house.png',
    0: 'list.png',
    3: 'join.png',
    4: 'subvencion4.png',
    5: 'programmer.png'
  };
  return base + (map[tipo] || 'farmer.png');
};
const parseDate = (date) => {
  if (!date) return 'NO';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

const MotionCard = _motion.create(Card);

const SocioCard = ({ socio, isNew = false, onCreate, onUpdate, onDelete, onCancel }) => {
  const createMode = isNew;
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(isNew);

  const [formData, setFormData] = useState({
    display_name: socio.display_name || '',
    user_name: socio.user_name || '',
    email: socio.email || '',
    dni: socio.dni || '',
    phone: socio.phone || 0,
    member_number: socio.member_number,
    plot_number: socio.plot_number || 0,
    notes: socio.notes || '',
    status: socio.status ?? 1,
    type: socio.type ?? 1,
    created_at: socio.created_at?.split('T')[0] || '',
    assigned_at: socio.assigned_at?.split('T')[0] || '',
    deactivated_at: socio.deactivated_at?.split('T')[0] || ''
  });

  const handleEdit = () => setEditMode(true);
  const handleDelete = () => typeof onDelete === "function" && onDelete(socio.user_id);
  const handleCancel = () => {
    if (isNew && onCancel) return onCancel();
    setEditMode(false);
    setError(null);
  };

  const handleSave = () => {
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) return setError("El teléfono no es válido.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) return setError("El email no es válido.");
    if (!formData.display_name.trim() || !formData.member_number) return setError("El nombre y número de socio son obligatorios.");
    setError(null);

    const updatedSocio = {
      ...socio,
      ...formData
    };

    if (createMode && typeof onCreate === "function") return onCreate(updatedSocio);
    if (typeof onUpdate === "function") onUpdate(updatedSocio, socio.user_id);
    setEditMode(false);
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <MotionCard className="socio-card shadow-sm rounded-4 h-100">
      <Card.Header className={`d-flex align-items-center rounded-4 rounded-bottom-0 justify-content-between ${getHeaderColor(formData.status)}`}>
        <div className="d-flex align-items-center p-1 m-0">
          {editMode ? (
            <TipoSocioDropdown value={formData.type} onChange={(val) => handleChange('type', val)} />
          ) : (
            <img src={getPFP(formData.type)} width="36" className="rounded me-3" alt="PFP" />
          )}
          <div className='d-flex flex-column gap-1'>
            <Card.Title className="m-0">
              {editMode ? (
                <Form.Control className="themed-input" size="sm" value={formData.display_name} onChange={(e) => handleChange('display_name', e.target.value)} style={{ maxWidth: '220px' }} />
              ) : formData.display_name}
            </Card.Title>
            {editMode ? (
              <Form.Select className="themed-input" size="sm" value={formData.status} onChange={(e) => handleChange('status', parseInt(e.target.value))} style={{ maxWidth: '8rem' }}>
                <option value={1}>ACTIVO</option>
                <option value={0}>INACTIVO</option>
              </Form.Select>
            ) : (
              <Badge style={{ width: 'fit-content' }} bg={getBadgeColor(formData.status)}>{getEstado(formData.status)}</Badge>
            )}
          </div>
        </div>

        {!createMode && (
          <AnimatedDropdown
            className='end-0'
            buttonStyle='card-button'
            icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}>
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

        <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
          {[{
            label: 'DNI', icon: faIdCard, value: formData.dni, field: 'dni', type: 'text', maxWidth: '180px'
          }, {
            label: 'SOCIO Nº', icon: faUser, value: formData.member_number, field: 'member_number', type: 'number', maxWidth: '100px'
          }, {
            label: 'HUERTO Nº', icon: faSunPlantWilt, value: formData.plot_number, field: 'plot_number', type: 'number', maxWidth: '100px'
          }, {
            label: 'TLF.', icon: faPhone, value: formData.phone, field: 'phone', type: 'text', maxWidth: '200px'
          }, {
            label: 'EMAIL', icon: faAt, value: formData.email, field: 'email', type: 'text', maxWidth: '250px'
          }].map(({ label, icon, value, field, type, maxWidth }) => (
            <ListGroup.Item key={field} className="d-flex justify-content-between align-items-center">
              <span><FontAwesomeIcon icon={icon} className="me-2" />{label}</span>
              {editMode ? (
                <Form.Control className="themed-input" size="sm" type={type} value={value} onChange={(e) => handleChange(field, e.target.value)} style={{ maxWidth }} />
              ) : (
                <strong>{parseNull(value)}</strong>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {getFechas(formData, editMode, handleChange)}

        <Card className="mt-2 border-1 rounded-3 notas-card">
          <Card.Body>
            <Card.Subtitle className="mb-2">
              {editMode ? (
                <><FontAwesomeIcon icon={faClipboard} className="me-2" />NOTAS (máx. 256)</>
              ) : (
                <><FontAwesomeIcon icon={faClipboard} className="me-2" />NOTAS</>
              )}
            </Card.Subtitle>
            {editMode ? (
              <Form.Control className="themed-input" as="textarea" rows={3} value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} />
            ) : (
              <Card.Text>{parseNull(formData.notes)}</Card.Text>
            )}
          </Card.Body>
        </Card>

        {editMode && (
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="danger" size="sm" onClick={handleCancel}>Cancelar</Button>
            <Button variant="success" size="sm" onClick={handleSave}>Guardar</Button>
          </div>
        )}
      </Card.Body>
    </MotionCard>
  );
};

SocioCard.propTypes = {
  socio: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
};

export default SocioCard;

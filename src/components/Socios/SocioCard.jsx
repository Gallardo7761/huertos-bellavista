import { useEffect, useState } from 'react';
import {
  Card, ListGroup, Badge, Button, Form
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard, faUser, faSunPlantWilt, faPhone, faClipboard, faAt,
  faEllipsisVertical, faEdit, faTrash, faMoneyBill,
  faCheck,
  faXmark,
  faCalendar,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import '../../css/SocioCard.css';
import TipoSocioDropdown from './TipoSocioDropdown';
import { getNowAsLocalDatetime } from '../../util/date';
import { generateSecurePassword } from '../../util/passwordGenerator';
import { DateParser } from '../../util/parsers/dateParser';
import { renderErrorAlert } from '../../util/alertHelpers';

const getFechas = (formData, editMode, handleChange) => {
  const { created_at, assigned_at, deactivated_at } = formData;

  if (!editMode && !created_at && !assigned_at && !deactivated_at) return null;

  return (
    <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />ALTA</span>
        {editMode ? (
          <Form.Control
            type="datetime-local"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={created_at}
            onChange={(e) => handleChange('created_at', e.target.value)}
          />
        ) : (
          <strong>{DateParser.isoToStringWithTime(created_at)}</strong>
        )}
      </ListGroup.Item>

      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />ENTREGA</span>
        {editMode ? (
          <Form.Control
            type="datetime-local"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={assigned_at}
            onChange={(e) => handleChange('assigned_at', e.target.value)}
          />
        ) : (
          <strong>{DateParser.isoToStringWithTime(assigned_at)}</strong>
        )}
      </ListGroup.Item>

      <ListGroup.Item className="d-flex justify-content-between align-items-center">
        <span><FontAwesomeIcon icon={faCalendar} className="me-2" />BAJA</span>
        {editMode ? (
          <Form.Control
            type="datetime-local"
            size="sm"
            className="themed-input"
            style={{ maxWidth: '200px' }}
            value={deactivated_at}
            onChange={(e) => handleChange('deactivated_at', e.target.value)}
          />
        ) : (
          <strong>{DateParser.isoToStringWithTime(deactivated_at)}</strong>
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

const MotionCard = _motion.create(Card);

const SocioCard = ({ socio, isNew = false, onCreate, onUpdate, onDelete, onCancel, onViewIncomes, error, onClearError }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(isNew);
  const [showPassword, setShowPassword] = useState(false);
  const [latestNumber, setLatestNumber] = useState(null);

  const [formData, setFormData] = useState({
    display_name: socio.display_name,
    user_name: socio.user_name,
    email: socio.email || '',
    dni: socio.dni,
    phone: socio.phone,
    member_number: socio.member_number || latestNumber,
    plot_number: socio.plot_number,
    notes: socio.notes || '',
    status: socio.status,
    type: socio.type,
    created_at: socio.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
    assigned_at: socio.assigned_at?.slice(0, 16) || undefined,
    deactivated_at: socio.deactivated_at?.slice(0, 16) || undefined,
    global_role: 0,
    password: createMode ? generateSecurePassword() : '',
  });

  useEffect(() => {
    if(!editMode) {
      setFormData({
        display_name: socio.display_name,
        user_name: socio.user_name,
        email: socio.email || '',
        dni: socio.dni,
        phone: socio.phone,
        member_number: socio.member_number,
        plot_number: socio.plot_number,
        notes: socio.notes || '',
        status: socio.status,
        type: socio.type,
        created_at: socio.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
        assigned_at: socio.assigned_at?.slice(0, 16) || undefined,
        deactivated_at: socio.deactivated_at?.slice(0, 16) || undefined,
        global_role: 0,
        password: createMode ? generateSecurePassword() : ''
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socio, editMode]);

  useEffect(() => {
    const fetchLastNumber = async () => {
      try {
        if(!(createMode || editMode)) return;
        const res = await fetch("https://api.huertosbellavista.es/v1/members/latest-number");
        const data = await res.json();
        setLatestNumber(data.data.lastMemberNumber+1 );
      } catch (err) {
        console.error("Error al obtener el número de socio:", err);
      }
    };

    fetchLastNumber();
  }, [createMode, editMode]);

  const handleEdit = () => {
    if (onClearError) onClearError();
    setEditMode(true);
  };

  const handleDelete = () => typeof onDelete === "function" && onDelete(socio.user_id);
  
  const handleCancel = () => {
    if (onClearError) onClearError();
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    if (onClearError) onClearError();
    const newSocio = { ...socio, ...formData };
    if (createMode && typeof onCreate === 'function') return onCreate(newSocio);
    if (typeof onUpdate === 'function') return onUpdate(newSocio, socio.user_id);
  };

  const handleChange = (field, value) => {
    if (["member_number"].includes(field)) {
      value = value === "" ? latestNumber : parseInt(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewIncomes = () => {
    onViewIncomes(socio.user_id);
  }

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

        {!createMode && !editMode && (
          <AnimatedDropdown
            className='end-0'
            buttonStyle='card-button'
            icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}>
            {({ closeDropdown }) => (
              <>
                <div className="dropdown-item d-flex align-items-center" onClick={() => { handleEdit(); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                </div>
                <div className="dropdown-item d-flex align-items-center" onClick={() => { handleViewIncomes(); closeDropdown(); }}>
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
        {(editMode || createMode) && renderErrorAlert(error)}

        <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
          {[{
            label: 'DNI', icon: faIdCard, value: formData.dni, field: 'dni', type: 'text', maxWidth: '180px'
          }, {
            label: 'SOCIO Nº', icon: faUser, value: formData.member_number || latestNumber, field: 'member_number', type: 'number', maxWidth: '100px'
          }, {
            label: 'HUERTO Nº', icon: faSunPlantWilt, value: formData.plot_number, field: 'plot_number', type: 'number', maxWidth: '100px'
          }, {
            label: 'TLF.', icon: faPhone, value: formData.phone, field: 'phone', type: 'number', maxWidth: '200px'
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
          {editMode && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><FontAwesomeIcon icon={faKey} className="me-2" />CONTRASEÑA</span>
              <div className="d-flex align-items-center gap-2" style={{ maxWidth: 'fit-content' }}>
                <Form.Control
                  className="themed-input"
                  size="sm"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  style={{ maxWidth: '200px' }}
                />
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleChange('password', generateSecurePassword())}
                >
                  Generar
                </Button>
              </div>
            </ListGroup.Item>
          )}

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

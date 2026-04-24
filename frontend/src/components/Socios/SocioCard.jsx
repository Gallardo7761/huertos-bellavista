import { useEffect, useState } from 'react';
import {
  Card, ListGroup, Badge, Button, Form,
  Tooltip, OverlayTrigger
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
import { useDataContext } from "../../hooks/useDataContext";
import SpanishDateTimePicker from '../SpanishDateTimePicker';

const renderDateField = (label, icon, dateValue, editMode, fieldKey, handleChange) => {
  if (!editMode && !dateValue) return null;

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <span><FontAwesomeIcon icon={icon} className="me-2" />{label}</span>
      {editMode ? (
        <SpanishDateTimePicker
          selected={dateValue ? new Date(dateValue) : null}
          onChange={(date) =>
            date ? handleChange(fieldKey, date.toISOString()) : handleChange(fieldKey, null)
          }
        />
      ) : (
        <strong>{DateParser.isoToStringWithTime(dateValue)}</strong>
      )}
    </ListGroup.Item>
  );
};

const getFechas = (formData, editMode, handleChange) => {
  const { createdAt, assignedAt, deactivatedAt } = formData;

  // Si no hay fechas y no está en modo edición, no muestres nada
  if (!editMode && !createdAt && !assignedAt && !deactivatedAt) return null;

  return (
    <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
      {renderDateField("ALTA", faCalendar, createdAt, editMode, "createdAt", handleChange)}
      {renderDateField("ENTREGA", faCalendar, assignedAt, editMode, "assignedAt", handleChange)}
      {renderDateField("BAJA", faCalendar, deactivatedAt, editMode, "deactivatedAt", handleChange)}
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
    1: 'farmer.svg',
    2: 'green_house.svg',
    0: 'list.svg',
    3: 'join.svg',
    4: 'subvencion4.svg',
    5: 'programmer.svg'
  };
  return base + (map[tipo] || 'farmer.svg');
};

const MotionCard = _motion.create(Card);

const SocioCard = ({ identity, isNew = false, onCreate, onUpdate, onCancel, onViewIncomes, positionIfWaitlist, fieldErrors }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(isNew);
  const [showPassword, setShowPassword] = useState(false);
  const [latestNumber, setLatestNumber] = useState(null);
  const { getData } = useDataContext();

  const [formData, setFormData] = useState({
    displayName: identity?.user.displayName,
    userName: identity?.account.username,
    email: identity?.account.email || '',
    dni: identity?.metadata.dni,
    phone: identity?.metadata.phone,
    memberNumber: identity?.metadata.memberNumber,
    plotNumber: identity?.metadata.plotNumber,
    notes: identity?.metadata.notes || '',
    status: identity?.account.status,
    type: identity?.metadata.type,
    createdAt: identity?.metadata.createdAt || (isNew ? getNowAsLocalDatetime() : ''),
    assignedAt: identity?.metadata.assignedAt || undefined,
    deactivatedAt: identity?.metadata.deactivatedAt || undefined,
    globalRole: 0,
    password: createMode && !editMode ? generateSecurePassword() : null,
  });

  const getFieldError = (field) => fieldErrors?.[field] ?? null;

  useEffect(() => {
    if (!editMode) {
      setFormData({
        displayName: identity.user.displayName,
        userName: identity.account.username,
        email: identity.account.email || '',
        dni: identity.metadata.dni,
        phone: identity.metadata.phone,
        memberNumber: identity.metadata.memberNumber,
        plotNumber: identity.metadata.plotNumber,
        notes: identity.metadata.notes || '',
        status: identity.account.status,
        type: identity.metadata.type,
        createdAt: identity.metadata.createdAt || (isNew ? getNowAsLocalDatetime() : ''),
        assignedAt: identity.metadata.assignedAt || undefined,
        deactivatedAt: identity.metadata.deactivatedAt || undefined,
        globalRole: 0,
        password: createMode ? generateSecurePassword() : ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, editMode]);

  useEffect(() => {
    const fetchLastNumber = async () => {
      try {
        if (!(createMode || editMode)) return;

        const latestNumber = import.meta.env.MODE === 'production' ?
          await getData("https://api.huertosbellavista.es/v2/huertos/users/latest-number", {}, false)
          : await getData("http://localhost:10001/v2/huertos/users/latest-number", {}, false);

        const nuevoNumero = latestNumber + 1;
        setLatestNumber(nuevoNumero);

        setFormData(prev => ({
          ...prev,
          memberNumber: prev.memberNumber || nuevoNumero
        }));
      } catch (err) {
        console.error("Error al obtener el número de socio:", err);
      }
    };

    fetchLastNumber();
  }, [createMode, editMode, getData]);

  useEffect(() => {
    if (formData.deactivatedAt && formData.status !== 0) {
      setFormData(prev => ({ ...prev, status: 0 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.deactivatedAt]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    const newSocio = {
      user: {
        userId: identity?.user?.userId || null,
        displayName: formData.displayName,
        globalStatus: formData.status,
        globalRole: formData.globalRole || 0,
        createdAt: formData.createdAt,
        updatedAt: formData.updatedAt || new Date().toISOString()
      },
      account: {
        credentialId: identity?.account?.credentialId || null,
        userId: identity?.user?.userId || null,
        username: formData.userName,
        email: formData.email,
        status: formData.status,
        serviceId: 1,
        createdAt: formData.createdAt,
        updatedAt: formData.updatedAt || new Date().toISOString()
      },
      metadata: {
        userId: identity?.user?.userId || null,
        memberNumber: formData.memberNumber,
        plotNumber: formData.plotNumber,
        dni: formData.dni,
        phone: formData.phone,
        type: formData.type,
        role: 0,
        notes: formData.notes || null,
        createdAt: formData.createdAt,
        assignedAt: formData.assignedAt || null,
        deactivatedAt: formData.deactivatedAt || null
      }
    };

    const finalStatus = formData.deactivatedAt ? 0 : formData.status;
    const updatedSocio = {
      user: {
        ...identity.user,
        displayName: formData.displayName
      },
      account: {
        ...identity.account,
        email: formData.email,
        password: formData.password,
        status: finalStatus
      },
      metadata: {
        ...identity.metadata,
        dni: formData.dni,
        phone: formData.phone,
        type: formData.type,
        plotNumber: formData.plotNumber,
        assignedAt: formData.assignedAt,
        deactivatedAt: formData.deactivatedAt,
        notes: formData.notes
      }
    };

    console.log(updatedSocio);

    if (createMode && typeof onCreate === 'function') return onCreate(newSocio);
    if (typeof onUpdate === 'function') return onUpdate(updatedSocio, identity.user.userId);
  };

  const handleChange = (field, value) => {
    if (["memberNumber"].includes(field)) {
      value = value === "" ? latestNumber : parseInt(value);
    }
    if (field === "displayName") {
      value = value.toUpperCase();
    }
    if (field === "dni") {
      value = value.toUpperCase();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewIncomes = () => {
    onViewIncomes(identity.user.userId);
  }

  return (
    <MotionCard className="socio-card shadow-sm rounded-4 h-100">
      <Card.Header className={`d-flex align-items-center rounded-4 rounded-bottom-0 justify-content-between ${getHeaderColor(formData.status)}`}>
        <div className="d-flex align-items-center p-1 m-0">
          {editMode ? (
            <TipoSocioDropdown value={formData.type} onChange={(val) => handleChange('type', val)} />
          ) : (
            positionIfWaitlist && identity.metadata.type === 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    Nº <strong>{positionIfWaitlist}</strong> en la lista de espera
                  </Tooltip>
                }>
                <span className="me-3">
                  <img src={getPFP(formData.type)} width="36" className="rounded" alt="PFP" />
                </span>
              </OverlayTrigger>
            ) : (
              <img src={getPFP(formData.type)} width="36" className="rounded me-3" alt="PFP" />
            )
          )}
          <div className='d-flex flex-column gap-1'>
            <Card.Title className="m-0">
              {editMode ? (
                <>
                  <Form.Control className="themed-input" size="sm" isInvalid={!!fieldErrors?.displayName}
                    value={formData.displayName} onChange={(e) => handleChange('displayName', e.target.value)} style={{ maxWidth: '220px' }} />
                  <Form.Control.Feedback type="invalid" as="span">
                    {getFieldError("displayName")}
                  </Form.Control.Feedback>
                </>
              ) : formData.displayName}
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
              </>
            )}
          </AnimatedDropdown>
        )}
      </Card.Header>

      <Card.Body>
        <ListGroup className="mt-2 border-1 rounded-3 shadow-sm">
          {[{
            label: 'DNI', clazz: '', icon: faIdCard, value: formData.dni, field: 'dni', type: 'text', maxWidth: '180px'
          }, {
            label: 'SOCIO Nº', clazz: '', icon: faUser, value: formData.memberNumber ?? latestNumber, field: 'memberNumber', type: 'number', maxWidth: '100px'
          }, {
            label: 'HUERTO Nº', clazz: '', icon: faSunPlantWilt, value: formData.plotNumber, field: 'plotNumber', type: 'number', maxWidth: '100px'
          }, {
            label: 'TLF.', clazz: '', icon: faPhone, value: formData.phone, field: 'phone', type: 'number', maxWidth: '200px'
          }, {
            label: 'EMAIL', clazz: 'text-truncate', icon: faAt, value: formData.email, field: 'email', type: 'text', maxWidth: '250px'
          }].map(({ label, clazz, icon, value, field, type, maxWidth }) => (
            <ListGroup.Item key={field} className="d-flex justify-content-between align-items-center">
              <span><FontAwesomeIcon icon={icon} className="me-2" />{label}</span>
              {editMode ? (
                <>
                  <Form.Control className="themed-input" size="sm" type={type} value={value} isInvalid={!!fieldErrors?.[field]}
                    onChange={(e) => handleChange(field, e.target.value)} style={{ maxWidth }} />
                  <Form.Control.Feedback type="invalid" as="span">
                    {getFieldError(`${field}`)}
                  </Form.Control.Feedback>
                </>
              ) : (
                <strong className={clazz}>{parseNull(value)}</strong>
              )}
            </ListGroup.Item>
          ))}
          {editMode && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><FontAwesomeIcon icon={faKey} className="me-2" />CONTRASEÑA</span>
              <div className="d-flex align-items-center gap-2" style={{ maxWidth: 'fit-content' }}>
                <>
                  <Form.Control
                    className="themed-input"
                    size="sm"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    style={{ maxWidth: '200px' }}
                    isInvalid={!!fieldErrors?.password}
                  />
                  <Form.Control.Feedback type="invalid" as="span">
                    {getFieldError("password")}
                  </Form.Control.Feedback>
                </>
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
              <>
                <Form.Control className="themed-input" as="textarea" rows={3} value={formData.notes} isInvalid={!!fieldErrors?.notes}
                  onChange={(e) => handleChange('notes', e.target.value)} />
                <Form.Control.Feedback type="invalid" as="span">
                  {getFieldError("notes")}
                </Form.Control.Feedback>
              </>
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
  onDelete: PropTypes.func,
  onViewIncomes: PropTypes.func,
  onClearError: PropTypes.func,
  positionIfWaitlist: PropTypes.number,
  fieldErrors: PropTypes.object
};

export default SocioCard;

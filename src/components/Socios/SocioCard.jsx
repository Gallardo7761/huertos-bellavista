import { useState } from 'react';
import { Card, ListGroup, Badge, Dropdown, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faSunPlantWilt, faPhone, faClipboard, faAt, faEllipsisVertical, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '../../css/SocioCard.css';
import AnimatedDropdown from '../../components/AnimatedDropdown';

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

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(socio.idSocio);
    }
  };

  const handleCancel = () => {
    if (isNew && onCancel) return onCancel(); // borrar si es nueva
    setEditMode(false);
    if (error) setError(null);
    setFormData({
      telefono: socio.telefono || '',
      email: socio.email || '',
      notas: socio.notas || '',
      estado: socio.estado
    });
  };

  const handleSave = () => {
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(formData.telefono)) {
      setError("El teléfono no es válido.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setError("El email no es válido.");
      return;
    }

    if (!formData.nombre.trim() || !formData.numeroSocio) {
      setError("El nombre y número de socio son obligatorios.");
      return;
    }

    setError(null);

    if (createMode && typeof onCreate === "function") {
      const fullSocio = {
        idSocio: null,
        nombre: formData.nombre,
        usuario: (
          formData.nombre.toLowerCase().replace(/\s+/g, '') +
          formData.numeroSocio
        ),
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

      onCreate(fullSocio);
      return;
    }

    // 👇 Si no es nuevo, se edita
    if (typeof onUpdate === "function") {
      onUpdate(formData, socio.idSocio);
      setEditMode(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MotionCard className="socio-card shadow-sm border-0 h-100">
      <Card.Header className={`d-flex align-items-center justify-content-between ${getHeaderColor(socio.estado)}`}>
        <div className="d-flex align-items-center p-1 m-0">
          <img src={getPFP(socio.tipo)} width="36" className="rounded me-3" alt="PFP" />
          <div>

            <Card.Title className="m-0">
              {(editMode || createMode) ? (
                <Form.Control
                  size="sm"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre"
                  style={{ maxWidth: '220px' }}
                />
              ) : (
                socio.nombre
              )}
            </Card.Title>

            {editMode ? (
              <Form.Select
                size="sm"
                value={formData.estado}
                onChange={(e) => handleChange('estado', parseInt(e.target.value))}
                style={{ maxWidth: '8rem' }}
              >
                <option value={1}>ACTIVO</option>
                <option value={0}>INACTIVO</option>
              </Form.Select>
            ) : (
              <Badge bg={getBadgeColor(socio.estado)}>{getEstado(socio.estado)}</Badge>
            )}

          </div>
        </div>

        {!createMode && (
          <AnimatedDropdown
          icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl text-dark" />}
          className="p-0 border-0"
        >
          {({ closeDropdown }) => (
            <>
              <div className="dropdown-item d-flex align-items-center" onClick={() => { handleEdit(); closeDropdown(); }}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Editar
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleDelete(); closeDropdown(); }}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Eliminar
              </div>
            </>
          )}
        </AnimatedDropdown>
        
        )}

      </Card.Header>

      <Card.Body>
        {error && (
          <div className="alert alert-danger py-1 px-2 small" role="alert">
            {error}
          </div>
        )}
        <Card.Text as="div">
          <small dangerouslySetInnerHTML={{ __html: getFechas(socio) }} />
        </Card.Text>

        <ListGroup variant="flush" className="mt-2">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI</span>
            {(editMode || createMode) ? (
              <Form.Control
                size="sm"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value)}
                style={{ maxWidth: '180px' }}
              />
            ) : (
              <strong>{socio.dni}</strong>
            )}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faUser} className="me-2" />SOCIO Nº</span>
            {(editMode || createMode) ? (
              <Form.Control
                size="sm"
                type="number"
                value={formData.numeroSocio}
                onChange={(e) => handleChange('numeroSocio', e.target.value)}
                style={{ maxWidth: '100px' }}
              />
            ) : (
              <strong>{socio.numeroSocio}</strong>
            )}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faSunPlantWilt} className="me-2" />HUERTO Nº</span>
            {(editMode || createMode) ? (
              <Form.Control
                size="sm"
                type="number"
                value={formData.numeroHuerto}
                onChange={(e) => handleChange('numeroHuerto', e.target.value)}
                style={{ maxWidth: '100px' }}
              />
            ) : (
              <strong>{socio.numeroHuerto}</strong>
            )}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faPhone} className="me-2" />TLF.</span>
            {editMode ? (
              <Form.Control
                size="sm"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                style={{ maxWidth: '200px' }}
              />
            ) : (
              <span>{parseNull(socio.telefono)}</span>
            )}
          </ListGroup.Item>

          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faAt} className="me-2" />EMAIL</span>
            {editMode ? (
              <Form.Control
                size="sm"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{ maxWidth: '250px' }}
              />
            ) : (
              <small>{parseNull(socio.email)}</small>
            )}
          </ListGroup.Item>

        </ListGroup>

        <Card className="mt-3 notas-card">
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              <FontAwesomeIcon icon={faClipboard} className="me-2" />NOTAS
            </Card.Subtitle>
            {editMode ? (
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
              />
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
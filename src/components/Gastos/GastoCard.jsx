import { useState } from 'react';
import {
  Card, Badge, Button, Form
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMoneyBillWave,
  faFileInvoice,
  faTruck,
  faReceipt,
  faTrash,
  faEdit,
  faTimes,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { useTheme } from '../../hooks/useTheme';
import '../../css/IngresoCard.css';
import { CONSTANTS } from '../../util/constants';

const MotionCard = _motion.create(Card);

const formatDate = (iso) => {
  if (!iso) return "Fecha no disponible";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "Banco" : "Caja";
const getTypeColor = (type, theme) => type === 0 ? "primary" : theme === "light" ? "dark" : "light";
const getTypeTextColor = (type, theme) => type === 0 ? "light" : theme === "light" ? "light" : "dark";

const GastoCard = ({ gasto, isNew = false, onCreate, onUpdate, onDelete, onCancel }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(isNew);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    concept: gasto.concept || '',
    amount: gasto.amount || 0,
    supplier: gasto.supplier || '',
    invoice: gasto.invoice || '',
    type: gasto.type ?? 0,
    created_at: gasto.created_at || new Date().toISOString()
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleDelete = () => typeof onDelete === 'function' && onDelete(gasto.expense_id);
  const handleCancel = () => {
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
    setError(null);
  };

  const handleSave = () => {
    if (!formData.concept.trim()) return setError("El concepto es obligatorio.");
    if (!formData.supplier.trim()) return setError("El proveedor es obligatorio.");
    if (!formData.invoice.trim()) return setError("La factura es obligatoria.");
    if (formData.amount <= 0) return setError("El importe debe ser mayor que 0.");
    setError(null);

    const newGasto = {
      ...gasto,
      ...formData
    };

    if (createMode && typeof onCreate === 'function') return onCreate(newGasto);
    if (typeof onUpdate === 'function') onUpdate(newGasto, gasto.expense_id);
    setEditMode(false);
  };

  return (
    <MotionCard className="ingreso-card shadow-sm rounded-4 border-0 h-100">
      <Card.Header className="d-flex justify-content-between align-items-center rounded-top-4 bg-light-green">
        <div className="d-flex flex-column">
          <span className="fw-bold">
            <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
            {editMode ? (
              <Form.Control className="themed-input"  size="sm" value={formData.concept} onChange={(e) => handleChange('concept', e.target.value)} />
            ) : formData.concept}
          </span>
          <small>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {formatDate(formData.created_at)}
          </small>
        </div>
        {!createMode && (
          <AnimatedDropdown className='end-0' icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl text-dark" />}>
            {({ closeDropdown }) => (
              <>
                <div className="dropdown-item d-flex align-items-center" onClick={() => { setEditMode(true); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                </div>
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

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input"  size="sm" type="number" step="0.01" value={formData.amount} onChange={(e) => handleChange('amount', parseFloat(e.target.value))} style={{ maxWidth: '150px', display: 'inline-block' }} />
          ) : `${formData.amount.toFixed(2)} €`}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          <strong>Proveedor:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input"  size="sm" type="text" value={formData.supplier} onChange={(e) => handleChange('supplier', e.target.value)} />
          ) : formData.supplier}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faReceipt} className="me-2" />
          <strong>Factura:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input"  size="sm" type="text" value={formData.invoice} onChange={(e) => handleChange('invoice', e.target.value)} />
          ) : formData.invoice}
        </Card.Text>

        {editMode ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de gasto</Form.Label>
              <Form.Select className='themed-input' size="sm" value={formData.type} onChange={(e) => handleChange('type', parseInt(e.target.value))}>
                <option value={0}>Banco</option>
                <option value={1}>Caja</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /> Cancelar</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
            </div>
          </>
        ) : (
          <div className="text-end">
            <Badge bg={getTypeColor(formData.type, theme)} text={getTypeTextColor(formData.type, theme)}>
              {getTypeLabel(formData.type)}
            </Badge>
          </div>
        )}
      </Card.Body>
    </MotionCard>
  );
};

GastoCard.propTypes = {
  gasto: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func
};

export default GastoCard;

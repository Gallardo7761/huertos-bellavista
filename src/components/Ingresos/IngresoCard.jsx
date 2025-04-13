import { useState } from 'react';
import {
  Card, Badge, Button, Form
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faMoneyBillWave,
  faFileInvoice,
  faTrash,
  faEdit,
  faTimes,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { CONSTANTS } from '../../util/constants';
import '../../css/IngresoCard.css';
import { useTheme } from '../../hooks/useTheme';

const MotionCard = _motion.create(Card);

const formatDate = (iso) => {
  if (!iso) return "Fecha no disponible";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "Banco" : "Caja";
const getFrequencyLabel = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "Semestral" : "Anual";

const getTypeColor = (type, theme) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "primary" : theme === "light" ? "dark" : "light";
const getTypeTextColor = (type, theme) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "light" : theme === "light" ? "light" : "dark";
const getFreqColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "warning" : "danger";
const getFreqTextColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "dark" : "light";

const IngresoCard = ({ income, isNew = false, onCreate, onUpdate, onDelete, onCancel }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(isNew);
  const [error, setError] = useState(null);
  const {theme} = useTheme();

  const [formData, setFormData] = useState({
    concept: income.concept || '',
    amount: income.amount || 0,
    type: income.type ?? CONSTANTS.PAYMENT_TYPE_CASH,
    frequency: income.frequency ?? CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
    member_number: income.member_number,
    created_at: income.created_at || new Date().toISOString()
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleDelete = () => typeof onDelete === 'function' && onDelete(income.income_id);
  const handleCancel = () => {
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
    setError(null);
  };

  const handleSave = () => {
    if (!formData.concept.trim()) return setError("El concepto es obligatorio.");
    if (formData.amount <= 0) return setError("El importe debe ser mayor que 0.");
    if (!formData.member_number) return setError("Falta el número de socio.");
    setError(null);

    const newIncome = {
      ...income,
      ...formData
    };

    if (createMode && typeof onCreate === 'function') return onCreate(newIncome);
    if (typeof onUpdate === 'function') onUpdate(newIncome, income.income_id);
    setEditMode(false);
  };

  return (
    <MotionCard className="ingreso-card shadow-sm rounded-4 border-0 h-100">
      <Card.Header className="d-flex justify-content-between align-items-center rounded-top-4 bg-light-green">
        <div className="d-flex flex-column">
          <span className="fw-bold">
            <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
            {editMode ? (
              <Form.Control size="sm" value={formData.concept} onChange={(e) => handleChange('concept', e.target.value)} />
            ) : formData.concept}
          </span>
          <small>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {formatDate(formData.created_at)}
          </small>
        </div>
        {!createMode && (
          <AnimatedDropdown className='end-0' icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}>
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
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <strong>Socio Nº:</strong>{' '}
          {editMode ? (
            <Form.Control size="sm" type="number" value={formData.member_number} onChange={(e) => handleChange('member_number', parseInt(e.target.value))} style={{ maxWidth: '150px', display: 'inline-block' }} />
          ) : formData.member_number}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong>{' '}
          {editMode ? (
            <Form.Control size="sm" type="number" step="0.01" value={formData.amount} onChange={(e) => handleChange('amount', parseFloat(e.target.value))} style={{ maxWidth: '150px', display: 'inline-block' }} />
          ) : `${formData.amount.toFixed(2)} €`}
        </Card.Text>

        {editMode ? (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Tipo de pago</Form.Label>
              <Form.Select size="sm" value={formData.type} onChange={(e) => handleChange('type', parseInt(e.target.value))}>
                <option value={CONSTANTS.PAYMENT_TYPE_CASH}>Caja</option>
                <option value={CONSTANTS.PAYMENT_TYPE_BANK}>Banco</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Frecuencia</Form.Label>
              <Form.Select size="sm" value={formData.frequency} onChange={(e) => handleChange('frequency', parseInt(e.target.value))}>
                <option value={CONSTANTS.PAYMENT_FREQUENCY_YEARLY}>Anual</option>
                <option value={CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY}>Semestral</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /> Cancelar</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
            </div>
          </>
        ) : (
          <div className="text-end">
            <Badge bg={getTypeColor(formData.type, theme)} text={getTypeTextColor(formData.type, theme)} className="me-1">{getTypeLabel(formData.type)}</Badge>
            <Badge bg={getFreqColor(formData.frequency)} text={getFreqTextColor(formData.frequency)}>{getFrequencyLabel(formData.frequency)}</Badge>
          </div>
        )}
      </Card.Body>
    </MotionCard>
  );
};

IngresoCard.propTypes = {
  income: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func
};

export default IngresoCard;

import { useEffect, useState } from 'react';
import {
  Card, Badge, Button, Form
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
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
import { DateParser } from '../../util/parsers/dateParser';
import { renderErrorAlert } from '../../util/alertHelpers';
import { getNowAsLocalDatetime } from '../../util/date';
import SpanishDateTimePicker from '../SpanishDateTimePicker';

const MotionCard = _motion.create(Card);

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "Banco" : "Caja";
const getTypeColor = (type, theme) => type === 0 ? "primary" : theme === "light" ? "dark" : "light";
const getTypeTextColor = (type, theme) => type === 0 ? "light" : theme === "light" ? "light" : "dark";

const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    1: 'cash.svg',
    0: 'bank.svg'
  };
  return base + (map[tipo] || 'farmer.svg');
};

const GastoCard = ({ gasto, isNew = false, onCreate, onUpdate, onDelete, onCancel, error, onClearError }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(createMode);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    concept: gasto.concept || '',
    amount: gasto.amount || 0,
    supplier: gasto.supplier || '',
    invoice: gasto.invoice || '',
    type: gasto.type ?? 0,
    created_at: gasto.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
  });

  useEffect(() => {
    if (!editMode) {
      setFormData({
        concept: gasto.concept || '',
        amount: gasto.amount || 0,
        supplier: gasto.supplier || '',
        invoice: gasto.invoice || '',
        type: gasto.type ?? 0,
        created_at: gasto.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasto, editMode]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleDelete = () => typeof onDelete === 'function' && onDelete(gasto.expense_id);

  const handleCancel = () => {
    if (onClearError) onClearError();
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    if (onClearError) onClearError();
    const newExpense = { ...gasto, ...formData };
    if (createMode && typeof onCreate === 'function') return onCreate(newExpense);
    if (typeof onUpdate === 'function') return onUpdate(newExpense, gasto.expense_id);
  };

  return (
    <MotionCard className="ingreso-card shadow-sm rounded-4 border-0 h-100">
      <Card.Header className="d-flex justify-content-between align-items-center rounded-top-4 bg-light-green">
        <div className="d-flex align-items-center">
          <img src={getPFP(formData.type)} width={36} alt="Tipo de gasto" className='me-3' />
          <div className="d-flex flex-column">
            <span className="fw-bold">
              {editMode ? (
                <Form.Control
                  className="themed-input"
                  size="sm"
                  value={formData.concept}
                  onChange={(e) => handleChange('concept', e.target.value.toUpperCase())}
                />
              ) : formData.concept}
            </span>
            <small>
              {editMode ? (
                <SpanishDateTimePicker
                  selected={new Date(formData.created_at)}
                  onChange={(date) =>
                    handleChange('created_at', date.toISOString().slice(0, 16))
                  }
                />
              ) : (
                DateParser.isoToStringWithTime(formData.created_at)
              )}
            </small>
          </div>
        </div>

        {!createMode && !editMode && (
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
        {(editMode || createMode) && renderErrorAlert(error)}

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input" size="sm" type="number" step="0.01" value={formData.amount} onChange={(e) => handleChange('amount', parseFloat(e.target.value))} style={{ maxWidth: '150px', display: 'inline-block' }} />
          ) : `${formData.amount.toFixed(2)} €`}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          <strong>Proveedor:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input" size="sm" type="text" value={formData.supplier} onChange={(e) => handleChange('supplier', e.target.value)} />
          ) : formData.supplier}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faReceipt} className="me-2" />
          <strong>Factura:</strong>{' '}
          {editMode ? (
            <Form.Control className="themed-input" size="sm" type="text" value={formData.invoice} onChange={(e) => handleChange('invoice', e.target.value)} />
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

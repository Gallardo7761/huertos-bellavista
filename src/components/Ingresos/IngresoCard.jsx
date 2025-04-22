import { useEffect, useState } from 'react';
import {
  Card, Badge, Button, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMoneyBillWave,
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
import { DateParser } from '../../util/parsers/dateParser';
import { renderErrorAlert } from '../../util/alertHelpers';
import { getNowAsLocalDatetime } from '../../util/date';
import SpanishDateTimePicker from '../SpanishDateTimePicker';

const MotionCard = _motion.create(Card);

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "Banco" : "Caja";
const getFrequencyLabel = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "Semestral" : "Anual";

const getTypeColor = (type, theme) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "primary" : theme === "light" ? "dark" : "light";
const getTypeTextColor = (type, theme) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "light" : theme === "light" ? "light" : "dark";
const getFreqColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "warning" : "danger";
const getFreqTextColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "dark" : "light";

const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    0: 'cash.svg',
    1: 'bank.svg'
  };
  return base + (map[tipo] || 'farmer.svg');
};

const IngresoCard = ({
  income,
  isNew = false,
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
  className = '',
  editable = true,
  error,
  onClearError,
  members = []
}) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(createMode);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    concept: income.concept || '',
    amount: income.amount || 0,
    type: income.type ?? CONSTANTS.PAYMENT_TYPE_CASH,
    frequency: income.frequency ?? CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
    member_number: income.member_number,
    created_at: income.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
  });

  useEffect(() => {
    if (!editMode) {
      setFormData({
        concept: income.concept || '',
        amount: income.amount || 0,
        type: income.type ?? CONSTANTS.PAYMENT_TYPE_CASH,
        frequency: income.frequency ?? CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
        display_name: income.display_name,
        member_number: income.member_number,
        created_at: income.created_at?.slice(0, 16) || (isNew ? getNowAsLocalDatetime() : ''),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, editMode]);

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleCancel = () => {
    if (onClearError) onClearError();
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    if (onClearError) onClearError();
    const newIncome = { ...income, ...formData };
    if (createMode && typeof onCreate === 'function') return onCreate(newIncome);
    if (typeof onUpdate === 'function') return onUpdate(newIncome, income.income_id);
  };

  const handleDelete = () => typeof onDelete === 'function' && onDelete(income.income_id);

  const uniqueMembers = Array.from(
    new Map(members.map(item => [item.member_number, item])).values()
  ).sort((a, b) => a.member_number - b.member_number);

  return (
    <MotionCard className={`ingreso-card shadow-sm rounded-4 border-0 h-100 ${className}`}>
      <Card.Header className="rounded-top-4 bg-light-green">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <img src={getPFP(formData.type)} width={36} alt="Ingreso" className='me-3' />
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

          {editable && !createMode && !editMode && (
            <AnimatedDropdown
              className='ms-3'
              icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}
            >
              {({ closeDropdown }) => (
                <>
                  <div className="dropdown-item d-flex align-items-center" onClick={() => { setEditMode(true); onClearError && onClearError(); closeDropdown(); }}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                  </div>
                  <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleDelete(); closeDropdown(); }}>
                    <FontAwesomeIcon icon={faTrash} className="me-2" />Eliminar
                  </div>
                </>
              )}
            </AnimatedDropdown>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        {(editMode || createMode) && renderErrorAlert(error)}

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <strong>Socio:</strong>{' '}
          {createMode ? (
            <Form.Select
              className="themed-input"
              size="sm"
              value={formData.member_number}
              onChange={(e) => handleChange('member_number', parseInt(e.target.value))}
              style={{ maxWidth: '300px', display: 'inline-block' }}
            >
              {uniqueMembers.map((m) => (
                <option key={m.member_number} value={m.member_number}>
                  {`${m.display_name} (${m.member_number})`}
                </option>
              ))}
            </Form.Select>
          ) : editMode ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Este campo no se puede editar. Para cambiar el socio, elimina y vuelve a crear el ingreso.</Tooltip>}
            >
              <Form.Control
                className="themed-input"
                disabled
                size="sm"
                type="text"
                value={`${formData.display_name || 'Socio'} (${formData.member_number})`}
                style={{ maxWidth: '300px', display: 'inline-block' }}
              />
            </OverlayTrigger>
          ) : (
            formData.display_name ? (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{formData.display_name}</Tooltip>}
                >
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '200px', verticalAlign: 'middle' }}>
                    {formData.display_name}
                  </span>
                </OverlayTrigger>
                &nbsp;({formData.member_number})
              </>
            ) : formData.member_number
          )}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong>{' '}
          {editMode ? (
            <Form.Control
              className="themed-input"
              size="sm"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              style={{ maxWidth: '150px', display: 'inline-block' }}
            />
          ) : `${formData.amount.toFixed(2)} €`}
        </Card.Text>

        {editMode ? (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Tipo de pago</Form.Label>
              <Form.Select
                className='themed-input'
                size="sm"
                value={formData.type}
                onChange={(e) => handleChange('type', parseInt(e.target.value))}
              >
                <option value={CONSTANTS.PAYMENT_TYPE_CASH}>Caja</option>
                <option value={CONSTANTS.PAYMENT_TYPE_BANK}>Banco</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Frecuencia</Form.Label>
              <Form.Select
                className='themed-input'
                size="sm"
                value={formData.frequency}
                onChange={(e) => handleChange('frequency', parseInt(e.target.value))}
              >
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
  onCancel: PropTypes.func,
  className: PropTypes.string,
  editable: PropTypes.bool,
  error: PropTypes.string,
  onClearError: PropTypes.func,
  members: PropTypes.array
};

export default IngresoCard;

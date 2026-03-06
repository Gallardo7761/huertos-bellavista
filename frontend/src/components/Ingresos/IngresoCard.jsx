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
    1: 'cash.svg',
    0: 'bank.svg'
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
  dropdown = new Map(),
  fieldErrors
}) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(createMode);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    concept: income.concept || '',
    amount: income.amount || 0,
    type: income.type ?? CONSTANTS.PAYMENT_TYPE_CASH,
    frequency: income.frequency ?? CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
    memberNumber: income.memberNumber,
    userId: income.userId,
    displayName: income.displayName || '',
    createdAt: income.createdAt || (isNew ? getNowAsLocalDatetime() : ''),
  });

  const getFieldError = (field) => fieldErrors?.[field] ?? null;

  useEffect(() => {
    if (!editMode) {
      setFormData({
        concept: income.concept || '',
        amount: income.amount || 0,
        type: income.type ?? CONSTANTS.PAYMENT_TYPE_CASH,
        frequency: income.frequency ?? CONSTANTS.PAYMENT_FREQUENCY_YEARLY,
        userId: income.userId,
        memberNumber: income.memberNumber,
        displayName: income.displayName || '',
        createdAt: income.createdAt || (isNew ? getNowAsLocalDatetime() : ''),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, editMode]);

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleCancel = () => {
    if (isNew && typeof onCancel === 'function') return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    const newIncome = { ...income, ...formData };
    if (createMode && typeof onCreate === 'function') return onCreate(newIncome);
    if (typeof onUpdate === 'function') return onUpdate(newIncome, income.incomeId);
  };

  const handleDelete = () => typeof onDelete === 'function' && onDelete(income.incomeId);

  const uniqueMembers = Array.from(dropdown.entries())
    .map(([memberNumber, member]) => ({
      memberNumber,
      ...member
    }))
    .sort((a, b) => a.memberNumber - b.memberNumber);

  return (
    <MotionCard className={`ingreso-card shadow-sm rounded-4 border-0 h-100 ${className}`}>
      <Card.Header className="rounded-top-4 bg-light-green">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <img src={getPFP(formData.type)} width={36} alt="Ingreso" className='me-3' />
            <div className="d-flex flex-column">
              <span className="fw-bold">
                {editMode ? (
                  <>
                    <Form.Control
                      className="themed-input"
                      size="sm"
                      value={formData.concept}
                      isInvalid={!!fieldErrors?.concept}
                      onChange={(e) => handleChange('concept', e.target.value.toUpperCase())}
                    />
                    <Form.Control.Feedback type="invalid" as="span">
                      {getFieldError("concept")}
                    </Form.Control.Feedback>
                  </>
                ) : formData.concept}
              </span>

              <small>
                {editMode ? (
                  <SpanishDateTimePicker
                    selected={new Date(formData.createdAt)}
                    onChange={(date) =>
                      handleChange('createdAt', date.toISOString())
                    }
                  />
                ) : (
                  DateParser.isoToStringWithTime(formData.createdAt)
                )}
              </small>
            </div>
          </div>

          {editable && !createMode && !editMode && (
            <AnimatedDropdown
              className='end-0'
              icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}
            >
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
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <strong>Socio:</strong>{' '}
          {createMode ? (
            <Form.Select
              className="themed-input"
              size="sm"
              value={formData.memberNumber ?? ""}
              onChange={(e) => {
                const memberNumber = parseInt(e.target.value, 10);
                const member = dropdown.get(memberNumber);

                handleChange('memberNumber', memberNumber);
                handleChange('userId', member?.userId ?? null);
                handleChange('displayName', member?.displayName ?? "");
              }}
            >
              <option value="" disabled>Selecciona socio</option>
              {uniqueMembers.map((i) => (
                <option key={i.memberNumber} value={i.memberNumber}>
                  {`${i.displayName} (${i.memberNumber})`}
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
                value={`${formData.displayName || 'Socio'} (${formData.memberNumber})`}
                style={{ maxWidth: '300px', display: 'inline-block' }}
              />
            </OverlayTrigger>
          ) : (
            formData.displayName ? (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{formData.displayName}</Tooltip>}
                >
                  <span className="text-truncate d-inline-block" style={{ maxWidth: '200px', verticalAlign: 'middle' }}>
                    {formData.displayName}
                  </span>
                </OverlayTrigger>
                &nbsp;({formData.memberNumber})
              </>
            ) : formData.memberNumber
          )}
        </Card.Text>

        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong>{' '}
          {editMode ? (
            <>
              <Form.Control
                className="themed-input"
                size="sm"
                type="number"
                step="0.01"
                isInvalid={!!fieldErrors?.amount}
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                style={{ maxWidth: '150px', display: 'inline-block' }}
              />
              <Form.Control.Feedback type="invalid" as="span">
                {getFieldError("amount")}
              </Form.Control.Feedback>
            </>
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
  members: PropTypes.array,
  fieldErrors: PropTypes.object
};

export default IngresoCard;

import { Card, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faMoneyBillWave,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import '../../css/IngresoCard.css';
import {CONSTANTS} from '../../util/constants';

const MotionCard = _motion.create(Card);

const formatDate = (iso) => {
  if (!iso) return "Fecha no disponible";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

const getTypeLabel = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "Banco" : "Caja";
const getFrequencyLabel = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "Semestral" : "Anual";

const getTypeColor = (type) => type === CONSTANTS.PAYMENT_TYPE_BANK ? "primary" : "dark";
const getFreqColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "warning " : "danger";
const getFreqTextColor = (freq) => freq === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY ? "dark" : "light";

const IngresoCard = ({ income }) => {
  return (
    <MotionCard className="ingreso-card shadow-sm rounded-4 border-0 h-100">
      <Card.Header className="d-flex justify-content-between align-items-center rounded-top-4 bg-light-green">
        <div className="d-flex flex-column">
          <span className="fw-bold">
            <FontAwesomeIcon icon={faFileInvoice} className="me-2" />
            {income.concept}
          </span>
          <small className="text-muted">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {formatDate(income.created_at)}
          </small>
        </div>
        <div className="text-end">
          <Badge bg={getTypeColor(income.type)} className="me-1">{getTypeLabel(income.type)}</Badge>
          <Badge bg={getFreqColor(income.frequency)} text={getFreqTextColor(income.frequency)}>{getFrequencyLabel(income.frequency)}</Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Text className="mb-2">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <strong>Socio Nº:</strong> {income.member_number}
        </Card.Text>

        <Card.Text className="mb-0">
          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
          <strong>Importe:</strong> {income.amount.toFixed(2)} €
        </Card.Text>
      </Card.Body>
    </MotionCard>
  );
};

IngresoCard.propTypes = {
  income: PropTypes.shape({
    income_id: PropTypes.number.isRequired,
    member_number: PropTypes.number.isRequired,
    concept: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    frequency: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired
  }).isRequired
};

export default IngresoCard;

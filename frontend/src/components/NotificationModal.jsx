import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
  faCircleExclamation,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import '../css/NotificationModal.css'

const iconMap = {
  success: faCircleCheck,
  danger: faCircleXmark,
  warning: faCircleExclamation,
  info: faCircleInfo
};

const NotificationModal = ({
  show,
  onClose,
  title,
  message,
  variant = "info",
  buttons = []
}) => {
  const modalButtons = buttons.length > 0 ? buttons : [{ label: "Aceptar", onClick: onClose }];

  return (
    <Modal show={show} onHide={onClose} centered className="custom-themed-modal" data-variant={variant}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={iconMap[variant] || faCircleInfo} className="me-2 icon-variant" />
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer>
        {modalButtons.map((btn, index) => (
          <button
            key={index}
            className={`btn-custom-modal ${btn.variant || 'primary'}`}
            onClick={btn.onClick || onClose}
          >
            {btn.label}
          </button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

NotificationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      onClick: PropTypes.func
    })
  )
};

export default NotificationModal;

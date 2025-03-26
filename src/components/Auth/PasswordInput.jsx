import { useState } from 'react';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import '../../css/PasswordInput.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({ value, onChange, name = "password" }) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(prev => !prev);

  return (
    <div className="d-flex">
      <FloatingLabel
        controlId="passwordInput"
        label={
          <>
            <FontAwesomeIcon icon={faKey} className="me-2" />
            Contraseña
          </>
        }
      >
        <Form.Control
          type={show ? "text" : "password"}
          placeholder="Contraseña"
          name={name}
          value={value}
          onChange={onChange}
          className="pe-5 rounded-end-0 rounded-4"
        />
      </FloatingLabel>

      <Button
        variant="link"
        className="show-button rounded-start-0 rounded-4"
        onClick={toggleShow}
        aria-label="Mostrar contraseña"
        tabIndex={-1}
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
      </Button>
    </div>
  );
};

export default PasswordInput;

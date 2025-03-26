import { useState } from 'react';
import '../css/PasswordInput.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({ value, onChange, name = "password" }) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(prev => !prev);

  return (
    <div className="form-floating d-flex">
      <input
        type={show ? "text" : "password"}
        className="form-control rounded-end-0 rounded-4"
        id="passwordInput"
        placeholder="Contraseña"
        name={name}
        value={value}
        onChange={onChange}
      />
      <button
        className="btn btn-success show-button rounded-start-0 rounded-4"
        type="button"
        onClick={toggleShow}
        aria-label="Mostrar contraseña"
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
      </button>
      <label htmlFor="passwordInput">
        <FontAwesomeIcon icon={faKey} className="me-2" />
        Contraseña
      </label>
    </div>
  );
};

export default PasswordInput;

import '../css/PasswordInput.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faKey } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = () => {
    return (
        <div className="form-floating d-flex">
            <input type="password" className="form-control rounded-end-0 rounded-4" id="passwordInput" placeholder="name@example.com" />
            <button className="btn btn-success show-button rounded-start-0 rounded-4" type="button">
                <FontAwesomeIcon icon={faEye} />
            </button>
            <label htmlFor="floatingInput">
                <FontAwesomeIcon icon={faKey} className="me-2" />
                Contraseña
            </label>
        </div>
    );
}

export default PasswordInput;
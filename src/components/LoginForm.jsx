import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/LoginForm.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import PasswordInput from './PasswordInput';

const LoginForm = () => {
    return (
        <div className="row m-0 p-0 my-5">
            <div className="rounded-5 col-md-6 col-lg-5 col-xxl-4 container shadow card p-5 d-flex flex-column gap-4">
                <h1 className="text-center">Inicio de sesión</h1>
                <form className="d-flex flex-column gap-5">
                    <div className="m-0 p-0 d-flex flex-column gap-3">
                        <div className="form-floating">
                            <input type="email" className="form-control rounded-4 focus-ring" id="floatingInput" placeholder="name@example.com" />
                            <label htmlFor="floatingInput">
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Correo/Usuario    
                            </label>
                        </div>
                        <PasswordInput />
                    </div>
                    <div className="row m-0 p-0 justify-content-center">
                        <button type="submit" className="btn btn-outline-success login-button">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../css/LoginForm.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PasswordInput from './PasswordInput.jsx';

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

import Container from '../Container.jsx';
import ContentWrapper from '../ContentWrapper.jsx';

const LoginForm = () => {
    const { login, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        usuario: "",
        dni: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("usuario", formState.usuario);
        formData.append("dni", formState.dni.toUpperCase());

        try {
            await login(formData);
            navigate("/"); // redirige al home al hacer login
        } catch (err) {
            console.error("Error de login:", err.message);
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <div className="rounded-5 col-md-6 col-lg-5 col-xxl-4 container shadow card p-5 d-flex flex-column gap-4">
                    <h1 className="text-center">Inicio de sesión</h1>
                    <form className="d-flex flex-column gap-5" onSubmit={handleSubmit}>
                        <div className="m-0 p-0 d-flex flex-column gap-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control rounded-4 focus-ring"
                                    id="floatingInput"
                                    placeholder="DNI o usuario"
                                    name="usuario"
                                    value={formState.usuario}
                                    onChange={handleChange}
                                />
                                <label htmlFor="floatingInput">
                                    <FontAwesomeIcon icon={faUser} className="me-2" />
                                    Usuario
                                </label>
                            </div>
                            <PasswordInput
                                value={formState.dni}
                                onChange={handleChange}
                                name="dni"
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger text-center py-2">
                                {error}
                            </div>
                        )}

                        <div className="row m-0 p-0 justify-content-center">
                            <button type="submit" className="btn login-button">
                                Iniciar sesión
                            </button>
                        </div>
                    </form>
                </div>
            </ContentWrapper>
        </Container>
    );
};

export default LoginForm;

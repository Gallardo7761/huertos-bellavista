import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Alert, FloatingLabel, Row, Col } from 'react-bootstrap';
import PasswordInput from './PasswordInput.jsx';

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

import CustomContainer from '../CustomContainer.jsx';
import ContentWrapper from '../ContentWrapper.jsx';

import '../../css/LoginForm.css';

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
            navigate("/");
        } catch (err) {
            console.error("Error de login:", err.message);
        }
    };

    return (
        <CustomContainer>
            <ContentWrapper>
                <div className="rounded-5 col-md-6 col-lg-5 col-xxl-4 container shadow card p-5 d-flex flex-column gap-4 login-card">
                    <h1 className="text-center">Inicio de sesión</h1>
                    <Form className="d-flex flex-column gap-5" onSubmit={handleSubmit}>
                        <div className="d-flex flex-column gap-3">
                            <FloatingLabel
                                controlId="floatingUsuario"
                                label={
                                    <>
                                        <FontAwesomeIcon icon={faUser} className="me-2" />
                                        Usuario
                                    </>
                                }
                            >
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    name="usuario"
                                    value={formState.usuario}
                                    onChange={handleChange}
                                    className="rounded-4"
                                />
                            </FloatingLabel>

                            <PasswordInput
                                value={formState.dni}
                                onChange={handleChange}
                                name="dni"
                            />
                        </div>

                        {error && (
                            <Alert variant="danger" className="text-center py-2 mb-0">
                                {error}
                            </Alert>
                        )}

                        <Row className="justify-content-center m-0 p-0">
                            <Col xs={12} className='p-0 m-0'>
                                <Button type="submit" className="login-button">
                                    Iniciar sesión
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </ContentWrapper>
        </CustomContainer>
    );
};

export default LoginForm;

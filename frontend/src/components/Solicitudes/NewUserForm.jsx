import { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useDataContext } from '../../hooks/useDataContext';
import PropTypes from 'prop-types';

const NewUserForm = ({ onSubmit, userType, plotNumber, fieldErrors }) => {
  const { getData } = useDataContext();
  const fetchedOnce = useRef(false);

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    zipCode: '',
    city: '',
    memberNumber: '',
    plotNumber: plotNumber,
    type: userType
  });

  useEffect(() => {
    const fetchLastNumber = async () => {
      if (fetchedOnce.current) return;
      fetchedOnce.current = true;

      try {
        const latestNumber = import.meta.env.MODE === 'production' ? 
        await getData("https://api.huertosbellavista.es/v2/huertos/users/latest-number", {}, false)
        : await getData("http://localhost:8081/v2/huertos/users/latest-number", {}, false);
        setForm((prev) => ({
          ...prev,
          memberNumber: latestNumber + 1
        }));
      } catch (err) {
        console.error("Error al obtener el número de socio:", err);
      }
    };

    fetchLastNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const trimmedName = form.displayName?.trim() ?? "";

    const nuevoUsername = trimmedName
      ? trimmedName.split(' ')[0].toLowerCase() + String(form.memberNumber) : "";

    if (form.username !== nuevoUsername) {
      setForm(prev => ({ ...prev, username: nuevoUsername }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.displayName]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let updatedValue = value;
  
    if (name === 'displayName' || name === 'dni') {
      updatedValue = value.toUpperCase();
    }
  
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(updatedValue) || '' : updatedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  const getFieldError = (field) => fieldErrors?.[field] ?? null;

  return (
    <>
      <Form onSubmit={handleSubmit} className="p-3 px-md-4">
        <Row className="gy-3">

          {[
            { label: 'Nombre completo', name: 'displayName', type: 'text', required: true },
            { label: 'Nombre de usuario', name: 'username', type: 'text', required: true },
            { label: 'DNI', name: 'dni', type: 'text', required: true, maxLength: 9 },
            { label: 'Teléfono', name: 'phone', type: 'tel', required: true },
            { label: 'Correo electrónico', name: 'email', type: 'email', required: true },
            { label: 'Domicilio', name: 'address', type: 'text' },
            { label: 'Código Postal', name: 'zipCode', type: 'text' },
            { label: 'Ciudad', name: 'city', type: 'text' }
          ].map(({ label, name, type, required, maxLength }) => (
            <Col md={4} key={name}>
              <Form.Group>
                <Form.Label className="fw-semibold">{label}</Form.Label>
                <Form.Control
                  className="themed-input shadow-sm"
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  maxLength={maxLength}
                  isInvalid={!!getFieldError(name)}
                />
                <Form.Control.Feedback type="invalid">
                  {getFieldError(name)}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          ))}

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold">Nº Socio</Form.Label>
              <Form.Control
                className="shadow-sm"
                disabled
                type="number"
                name="memberNumber"
                value={form.memberNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} className="text-center mt-3">
            <Button type="submit" variant="success" size="lg" className="px-5 shadow-sm">
              Enviar solicitud
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

NewUserForm.propTypes = {
  userType: PropTypes.number.isRequired,
  plotNumber: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fieldErrors: PropTypes.object
};

export default NewUserForm;

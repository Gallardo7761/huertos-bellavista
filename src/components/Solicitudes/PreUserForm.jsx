import { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useDataContext } from '../../hooks/useDataContext';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PreUserForm = ({ onSubmit, userType, plotNumber, errors = {} }) => {
  const { getData } = useDataContext();
  const fetchedOnce = useRef(false);

  const [form, setForm] = useState({
    user_name: '',
    display_name: '',
    dni: '',
    phone: '',
    email: '',
    address: '',
    zip_code: '',
    city: '',
    member_number: '',
    plot_number: plotNumber,
    type: userType,
    status: 1,
    role: 0
  });

  useEffect(() => {
    const fetchLastNumber = async () => {
      if (fetchedOnce.current) return;
      fetchedOnce.current = true;

      try {
        const { data, error } = await getData("https://api.huertosbellavista.es/v1/members/latest-number");
        if (error) throw new Error(error);

        setForm((prev) => ({
          ...prev,
          member_number: data.lastMemberNumber + 1
        }));
      } catch (err) {
        console.error("Error al obtener el número de socio:", err);
      }
    };

    fetchLastNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const trimmedName = form.display_name?.trim() ?? "";

    const nuevoUsername = trimmedName
      ? trimmedName.split(' ')[0].toLowerCase() : "";

    if (form.user_name !== nuevoUsername) {
      setForm(prev => ({ ...prev, user_name: nuevoUsername }));
    }
  }, [form.member_number, form.display_name, form.user_name]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let updatedValue = value;
  
    if (name === 'display_name' || name === 'dni') {
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

  return (
    <>
      {errors.general && <Alert variant="danger" className="my-2">{errors.general}</Alert>}

      <Form onSubmit={handleSubmit} className="p-3 px-md-4">
        <Row className="gy-3">

          {[
            { label: 'Nombre completo', name: 'display_name', type: 'text', required: true },
            { label: 'Nombre de usuario', name: 'user_name', type: 'text', required: true },
            { label: 'DNI', name: 'dni', type: 'text', required: true, maxLength: 9 },
            { label: 'Teléfono', name: 'phone', type: 'tel', required: true },
            { label: 'Correo electrónico', name: 'email', type: 'email', required: true },
            { label: 'Domicilio', name: 'address', type: 'text' },
            { label: 'Código Postal', name: 'zip_code', type: 'text' },
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
                  isInvalid={!!errors[name]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors[name]}
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
                name="member_number"
                value={form.member_number}
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

PreUserForm.propTypes = {
  userType: PropTypes.number.isRequired,
  plotNumber: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default PreUserForm;

import { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const PreUserForm = ({ onSubmit }) => {
  const fetchedOnce = useRef(false); // ✅ este flag evita múltiples peticiones

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
    plot_number: 0,
    type: 0,
    status: 1,
    role: 0
  });

  useEffect(() => {
    const fetchLastNumber = async () => {
      if (fetchedOnce.current) return;
      fetchedOnce.current = true;
      try {
        const res = await fetch("https://api.huertosbellavista.es/v1/members/latest-number");
        const data = await res.json();
        setForm((prev) => ({ ...prev, member_number: data.data.lastMemberNumber }));
      } catch (err) {
        console.error("Error al obtener el número de socio:", err);
      }
    };

    fetchLastNumber();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <Row className="gy-4">

        <Col md={4}>
          <Form.Group>
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control name="display_name" value={form.display_name} onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control name="user_name" value={form.user_name} onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>DNI</Form.Label>
            <Form.Control name="dni" value={form.dni} onChange={handleChange} required maxLength={9} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Domicilio</Form.Label>
            <Form.Control name="address" value={form.address} onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Código Postal</Form.Label>
            <Form.Control name="zip_code" value={form.zip_code} onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Ciudad</Form.Label>
            <Form.Control name="city" value={form.city} onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Nº Socio</Form.Label>
            <Form.Control disabled name="member_number" type="number" value={form.member_number} onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col xs={12} className="text-center mt-4">
          <Button type="submit" variant="primary">
            Enviar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PreUserForm;

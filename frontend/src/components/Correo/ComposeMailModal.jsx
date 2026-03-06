import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ComposeMailModal({ isOpen, onClose, onSend }) {
  const [formData, setFormData] = useState({
    from: '',
    to: [],
    subject: '',
    content: '',
    attachments: []
  });

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email || '';
      setFormData((prev) => ({ ...prev, from: email }));
    }
  }, [isOpen]);

   const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'to') {
      const toArray = value
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email !== '');
      setFormData({ ...formData, to: toArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Redactar Correo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTo">
            <Form.Label>Para:</Form.Label>
            <Form.Control
              type="text"
              name="to"
              value={formData.to.join(', ')}
              onChange={handleChange}
              placeholder="Separar múltiples correos con comas"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formSubject">
            <Form.Label>Asunto:</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formContent">
            <Form.Label>Contenido:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAttachments">
            <Form.Label>Adjuntos:</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

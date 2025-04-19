import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import '../../css/AnuncioCard.css';
import { renderErrorAlert } from '../../util/alertHelpers';
import {
  EditorProvider,
  Editor,
} from 'react-simple-wysiwyg';
import {
  Toolbar,
  Separator,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnClearFormatting,
} from 'react-simple-wysiwyg';

const PRIORITY_CONFIG = {
  0: { label: 'BAJA', className: 'text-success' },
  1: { label: 'MEDIA', className: 'text-warning' },
  2: { label: 'ALTA', className: 'text-danger' },
};

const formatDateTime = (iso) => {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
};

const AnuncioCard = ({ anuncio, isNew = false, onCreate, onUpdate, onDelete, onCancel, error, onClearError }) => {
  const createMode = isNew;
  const [editMode, setEditMode] = useState(createMode);
  const [showFullBody, setShowFullBody] = useState(false);

  const [formData, setFormData] = useState({
    body: anuncio.body || '',
    priority: anuncio.priority ?? 1,
    published_by: JSON.parse(localStorage.getItem('user'))?.user_id,
  });

  useEffect(() => {
    if (!editMode) {
      setFormData({
        body: anuncio.body || '',
        priority: anuncio.priority ?? 1,
        published_by: JSON.parse(localStorage.getItem('user'))?.user_id,
      });
    }
  }, [anuncio, editMode]);

  const handleEdit = () => {
    if (onClearError) onClearError();
    setEditMode(true);
  };

  const handleDelete = () => typeof onDelete === 'function' && onDelete(anuncio.announce_id);

  const handleCancel = () => {
    if (onClearError) onClearError();
    if (createMode && onCancel) return onCancel();
    setEditMode(false);
  };

  const handleSave = () => {
    if (onClearError) onClearError();
    const updated = { ...anuncio, ...formData };
    if (createMode && typeof onCreate === 'function') return onCreate(updated);
    if (typeof onUpdate === 'function') return onUpdate(updated, anuncio.announce_id);
  };

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const { date, time } = formatDateTime(anuncio.created_at);
  const priorityInfo = PRIORITY_CONFIG[formData.priority] || PRIORITY_CONFIG[1];
  const isLongBody = formData.body.length > 300;
  const displayBody = isLongBody && !showFullBody
    ? `${formData.body.slice(0, 300)}...`
    : formData.body;

  const insertImage = () => {
    const url = prompt('Introduce la URL de la imagen:');
    if (url) {
      const imgHTML = `<img src="${url}" alt="imagen" style="max-width: 100%;" />`;
      handleChange('body', formData.body + imgHTML);
    }
  };

  return (
    <Card className="anuncio-card rounded-4 border-0 shadow-sm mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center rounded-top-4 px-3 py-2">
        <div className="d-flex flex-column">
          <span className="fw-bold">📢&emsp;Anuncio #{anuncio.announce_id}</span>
          <small className="muted">
            Publicado el {date} a las {time} por{' '}
            <span className="fw-semibold">#{anuncio.published_by}</span>
          </small>
        </div>
        {!createMode && !editMode && (
          <AnimatedDropdown
            className="end-0"
            buttonStyle="bg-transparent border-0"
            icon={<FontAwesomeIcon icon={faEllipsisVertical} className="fa-xl" />}
          >
            {({ closeDropdown }) => (
              <>
                <div className="dropdown-item d-flex align-items-center" onClick={() => { handleEdit(); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-item d-flex align-items-center text-danger" onClick={() => { handleDelete(); closeDropdown(); }}>
                  <FontAwesomeIcon icon={faTrash} className="me-2" />Eliminar
                </div>
              </>
            )}
          </AnimatedDropdown>
        )}
      </Card.Header>

      <Card.Body className="py-3">
        {(editMode || createMode) && renderErrorAlert(error)}

        {editMode || createMode ? (
          <EditorProvider>
            <Editor
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              containerProps={{ className: 'mb-2' }}
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
                <BtnClearFormatting />
                <Separator />
                <BtnNumberedList />
                <BtnBulletList />
                <Separator />
                <BtnLink />
                <button
                  type="button"
                  onClick={insertImage}
                  className="btn"
                  title="Insertar imagen desde URL"
                >
                  🖼️
                </button>
              </Toolbar>
            </Editor>
          </EditorProvider>
        ) : (
          <>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: displayBody }} />

            {isLongBody && (
              <Button variant='info'
                className="fw-medium text-dark mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFullBody((prev) => !prev);
                }}
              >
                {showFullBody ? 'Leer menos' : 'Leer más'}
              </Button>
            )}
          </>
        )}

        {editMode && (
          <Form.Select
            className="mb-2 themed-input"
            value={formData.priority}
            onChange={(e) => handleChange('priority', parseInt(e.target.value))}
          >
            <option value={0}>Prioridad Baja</option>
            <option value={1}>Prioridad Media</option>
            <option value={2}>Prioridad Alta</option>
          </Form.Select>
        )}

        {editMode && (
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
            <Button variant="primary" size="sm" onClick={handleSave}>Guardar</Button>
          </div>
        )}
      </Card.Body>

      {!editMode && (
        <Card.Footer className="priority-footer text-center rounded-bottom-4 fw-medium py-2">
          Prioridad: <span className={`fw-bold ${priorityInfo.className}`}>{priorityInfo.label}</span>
        </Card.Footer>
      )}
    </Card>
  );
};

export default AnuncioCard;

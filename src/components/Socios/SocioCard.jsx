// SocioCard.jsx - React Bootstrap + CSS Custom + Framer Motion

import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faSunPlantWilt, faPhone, faClipboard, faEye, faAt } from '@fortawesome/free-solid-svg-icons';
import { motion as _motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '../../css/SocioCard.css';

const getFechas = (socio) => {
  let html = `<strong>ALTA:</strong> ${parseDate(socio.fechaDeAlta)}`;
  if (socio.fechaDeEntrega) html += `, <strong>ENTREGA:</strong> ${parseDate(socio.fechaDeEntrega)}`;
  if (socio.fechaDeBaja) html += `, <strong>BAJA:</strong> ${parseDate(socio.fechaDeBaja)}`;
  return html;
};

const getBadgeColor = (estado) => estado === 1 ? 'success' : 'danger';
const getHeaderColor = (estado) => estado === 1 ? 'bg-light-green' : 'bg-light-red';
const getEstado = (estado) => estado === 1 ? 'ACTIVO' : 'INACTIVO';
const parseNull = (attr) => attr === null || attr === '' ? 'NO' : attr;

const getPFP = (tipo) => {
  const base = '/images/icons/';
  const map = {
    HORTELANO: 'farmer.png',
    HORTELANO_INVERNADERO: 'green_house.png',
    LISTA_ESPERA: 'list.png',
    COLABORADOR: 'join.png',
    SUBVENCIONES: 'subvencion4.png',
    DESARROLLADOR: 'programmer.png'
  };
  return base + (map[tipo] || 'farmer.png');
};

const parseDate = (date) => {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
};

const MotionCard = _motion(Card);

const SocioCard = ({ socio, onVerIngresos }) => {
  return (
    <MotionCard className="socio-card shadow-sm border-0 h-100">
      <Card.Header className={`d-flex align-items-center justify-content-between ${getHeaderColor(socio.estado)}`}>
        <div className="d-flex align-items-center p-1 m-0">
          <img src={getPFP(socio.tipo)} width="44" className="rounded me-3" alt="PFP" />
          <div>
            <Card.Title className="m-0">{socio.nombre}</Card.Title>
            <Badge bg={getBadgeColor(socio.estado)}>{getEstado(socio.estado)}</Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Text as="div">
          <small dangerouslySetInnerHTML={{ __html: getFechas(socio) }} />
        </Card.Text>

        <ListGroup variant="flush" className="mt-2">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faIdCard} className="me-2" />DNI</span>
            <strong>{socio.dni}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faUser} className="me-2" />SOCIO Nº</span>
            <strong>{socio.numeroSocio}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faSunPlantWilt} className="me-2" />HUERTO Nº</span>
            <strong>{socio.numeroHuerto}</strong>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faPhone} className="me-2" />TLF.</span>
            <span>{parseNull(socio.telefono)}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span><FontAwesomeIcon icon={faAt} className="me-2" />EMAIL</span>
            <small>{parseNull(socio.email)}</small>
          </ListGroup.Item>
        </ListGroup>

        <Card className="mt-3">
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              <FontAwesomeIcon icon={faClipboard} className="me-2" />NOTAS
            </Card.Subtitle>
            <Card.Text>{parseNull(socio.notas)}</Card.Text>
          </Card.Body>
        </Card>

        <div className="mt-3 d-flex justify-content-start">
          <Button variant="success" onClick={() => onVerIngresos?.(socio.numeroSocio)}>
            <FontAwesomeIcon icon={faEye} className="me-2" />Ingresos
          </Button>
        </div>
      </Card.Body>
    </MotionCard>
  );
};

SocioCard.propTypes = {
  socio: PropTypes.object.isRequired,
  onVerIngresos: PropTypes.func
};

export default SocioCard;
import { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBullhorn, faFile, faConciergeBell } from '@fortawesome/free-solid-svg-icons';

const NavHerramientas = () => {
  const [showing, setShowing] = useState(false);

  return (
    <NavDropdown
      title={<><FontAwesomeIcon icon={faTools} className="me-2" />Herramientas</>}
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
    >
      <NavDropdown.Item as={Link} to="/anuncios">
        <FontAwesomeIcon icon={faBullhorn} className="me-2" />Anuncios
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/documentacion">
        <FontAwesomeIcon icon={faFile} className="me-2" />Documentación
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/solicitud">
        <FontAwesomeIcon icon={faConciergeBell} className="me-2" />Enviar una solicitud
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default NavHerramientas;

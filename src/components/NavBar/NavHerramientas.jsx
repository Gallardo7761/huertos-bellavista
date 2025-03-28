import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBullhorn, faFile, faConciergeBell } from '@fortawesome/free-solid-svg-icons';

const NavHerramientas = () => {
  const [showing, setShowing] = useState(false);

  return (
    <AnimatedDropdown
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
      trigger={
        <Link className="nav-link dropdown-toggle" role="button">
          <FontAwesomeIcon icon={faTools} className="me-2" />Herramientas
        </Link>
      }
    >
      <Link to="/anuncios" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faBullhorn} className="me-2" />Anuncios
      </Link>
      <Link to="/documentacion" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faFile} className="me-2" />Documentación
      </Link>
      <Link to="/solicitud" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faConciergeBell} className="me-2" />Enviar una solicitud
      </Link>
    </AnimatedDropdown>
  );
};

export default NavHerramientas;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const NavListaEspera = () => {
  const [showing, setShowing] = useState(false);

  return (
    <AnimatedDropdown
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
      trigger={
        <Link className="nav-link dropdown-toggle" role="button">
          <FontAwesomeIcon icon={faList} className="me-2" />Lista de espera
        </Link>
      }
    >
      <Link to="/lista-espera" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faEye} className="me-2" />Ver la lista
      </Link>
      <Link to="/alta" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faPlus} className="me-2" />Solicitar huerto
      </Link>
    </AnimatedDropdown>
  );
};

export default NavListaEspera;

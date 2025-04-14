import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear, faUsers, faMoneyBill, faWallet, faFileInvoice, faInbox
} from '@fortawesome/free-solid-svg-icons';

const NavGestion = () => {
  const [showing, setShowing] = useState(false);

  return (
    <AnimatedDropdown
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
      trigger={
        <Link className="nav-link dropdown-toggle" role="button">
          <FontAwesomeIcon icon={faGear} className="me-2" />Gestión
        </Link>
      }
    >
      <Link to="/gestion/socios" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faUsers} className="me-2" />Socios
      </Link>
      <Link to="/gestion/ingresos" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faMoneyBill} className="me-2" />Ingresos
      </Link>
      <Link to="/gestion/gastos" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faWallet} className="me-2" />Gastos
      </Link>
      <Link to="/gestion/balance" className="dropdown-item nav-link">
        <FontAwesomeIcon icon={faFileInvoice} className="me-2" />Balance
      </Link>
      <hr className="dropdown-divider" />
      <Link to="/gestion/altas" className="disabled text-muted dropdown-item nav-link">
        <FontAwesomeIcon icon={faInbox} className="me-2" />Solicitudes
      </Link>
    </AnimatedDropdown>
  );
};

export default NavGestion;

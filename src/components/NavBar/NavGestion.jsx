import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import AnimatedDropend from '../../components/AnimatedDropend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear, faUsers, faMoneyBill, faWallet, faFileInvoice,
  faEnvelope,
  faBellConcierge,
  faPeopleGroup
} from '@fortawesome/free-solid-svg-icons';
import useRequestCount from '../../hooks/useRequestCount';

const NavGestion = ({ onNavigate, externalExpanded }) => {
  const [showing, setShowing] = useState(false);
  const count = useRequestCount();

  return (
    <AnimatedDropdown
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
      trigger={
        <Link className={`nav-link dropdown-toggle ${externalExpanded ? "mt-3" : ""}`} role="button">
          <FontAwesomeIcon icon={faGear} className="me-2" />Gestión
        </Link>
      }
    >
      {/* Submenú lateral: Asociación */}
      <AnimatedDropend
        trigger={
          <Link className="nav-link dropdown-toggle" role='button'>
            <FontAwesomeIcon icon={faPeopleGroup} className="me-2" />Asociación
          </Link>
        }
      >
        <Link to="/gestion/socios" className="dropdown-item nav-link" onClick={onNavigate}>
          <FontAwesomeIcon icon={faUsers} className="me-2" />Socios
        </Link>
        <Link to="/gestion/ingresos" className="dropdown-item nav-link" onClick={onNavigate}>
          <FontAwesomeIcon icon={faMoneyBill} className="me-2" />Ingresos
        </Link>
        <Link to="/gestion/gastos" className="dropdown-item nav-link" onClick={onNavigate}>
          <FontAwesomeIcon icon={faWallet} className="me-2" />Gastos
        </Link>
        <Link to="/gestion/balance" className="dropdown-item nav-link" onClick={onNavigate}>
          <FontAwesomeIcon icon={faFileInvoice} className="me-2" />Balance
        </Link>
      </AnimatedDropend>

      <Link to="/gestion/solicitudes" className="dropdown-item nav-link" onClick={onNavigate}>
        <FontAwesomeIcon icon={faBellConcierge} />
        <span className="icon-with-badge">
          {count > 0 && <span className="icon-badge">{count}</span>}
        </span>&nbsp;
        Solicitudes
      </Link>

      <Link to="/correo" className="dropdown-item nav-link" onClick={onNavigate}>
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />Correo
      </Link>
    </AnimatedDropdown>
  );
};

export default NavGestion;

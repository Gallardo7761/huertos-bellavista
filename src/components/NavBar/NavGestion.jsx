import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDropdown from '../../components/AnimatedDropdown';
import AnimatedDropend from '../../components/AnimatedDropend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear, faUsers, faMoneyBill, faWallet, faFileInvoice,
  faEnvelope,
  faBellConcierge
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
          <Link to="#" className="nav-link dropdown-toggle">
            <FontAwesomeIcon icon={faGear} className="me-2" />Asociación
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

      <Link to="/gestion/solicitudes" className="text-muted dropdown-item nav-link" onClick={onNavigate}>
        <FontAwesomeIcon icon={faBellConcierge} />
        <span className="icon-with-badge me-2">
          {count > 0 && <span className="icon-badge">{count}</span>}
        </span>
        Solicitudes
      </Link>

      <Link to="/correo" className="disabled text-muted dropdown-item nav-link" onClick={onNavigate}>
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />Correo
      </Link>
    </AnimatedDropdown>
  );
};

export default NavGestion;

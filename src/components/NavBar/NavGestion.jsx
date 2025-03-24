import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faUsers,
  faMoneyBill,
  faWallet,
  faFileInvoice,
  faUserPlus,
  faShapes,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const NavGestion = () => {
  return (
    <li className="nav-item dropdown" id="nav-manage">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="dropdownGestion"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Gestión"
      >
        <FontAwesomeIcon icon={faGear} className="me-2" />Gestión
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdownGestion">
        <li>
          <Link className="dropdown-item" to="/gestion/socios" title="Socios">
            <FontAwesomeIcon icon={faUsers} className="me-2" />Socios
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/gestion/ingresos" title="Ingresos">
            <FontAwesomeIcon icon={faMoneyBill} className="me-2" />Ingresos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/gestion/gastos" title="Gastos">
            <FontAwesomeIcon icon={faWallet} className="me-2" />Gastos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/gestion/balance" title="Balance">
            <FontAwesomeIcon icon={faFileInvoice} className="me-2" />Balance
          </Link>
        </li>
        <div className="dropdown-divider"></div>
        <li>
          <Link className="dropdown-item" to="/gestion/altas" title="Altas">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />Solicitudes de alta
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/gestion/solicitudes" title="Solicitudes">
            <FontAwesomeIcon icon={faShapes} className="me-2" />Solicitudes Inver./Colab.
          </Link>
        </li>
        <div className="dropdown-divider"></div>
        <li>
          <Link className="dropdown-item disabled" to="/gestion/correoweb" title="Correo Web">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />Correo Web
          </Link>
        </li>
      </ul>
    </li>
  );
};

export default NavGestion;

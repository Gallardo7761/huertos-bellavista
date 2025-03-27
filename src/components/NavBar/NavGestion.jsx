import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear, faUsers, faMoneyBill, faWallet, faFileInvoice,
  faUserPlus, faShapes
} from '@fortawesome/free-solid-svg-icons';

const NavGestion = () => (
  <NavDropdown title={<><FontAwesomeIcon icon={faGear} className="me-2" />Gestión</>} id="nav-manage">
    <NavDropdown.Item as={Link} to="/gestion/socios">
      <FontAwesomeIcon icon={faUsers} className="me-2" />Socios
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/gestion/ingresos">
      <FontAwesomeIcon icon={faMoneyBill} className="me-2" />Ingresos
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/gestion/gastos">
      <FontAwesomeIcon icon={faWallet} className="me-2" />Gastos
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/gestion/balance">
      <FontAwesomeIcon icon={faFileInvoice} className="me-2" />Balance
    </NavDropdown.Item>
    <NavDropdown.Divider />
    <NavDropdown.Item as={Link} to="/gestion/altas">
      <FontAwesomeIcon icon={faUserPlus} className="me-2" />Solicitudes de alta
    </NavDropdown.Item>
    <NavDropdown.Item as={Link} to="/gestion/solicitudes">
      <FontAwesomeIcon icon={faShapes} className="me-2" />Solicitudes Inver./Colab.
    </NavDropdown.Item>
  </NavDropdown>
);

export default NavGestion;

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const NavHome = () => (
  <Nav.Link as={Link} to="/" title="Inicio">
    <FontAwesomeIcon icon={faHouse} className="me-2" />Inicio
  </Nav.Link>
);

export default NavHome;


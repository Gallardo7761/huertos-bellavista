import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const NavHome = () => {
  return (
    <li className="nav-item" id="nav-home">
      <Link className="nav-link" to="/" title="Inicio">
        <FontAwesomeIcon icon={faHouse} className="me-2" />Inicio
      </Link>
    </li>
  );
};

export default NavHome;
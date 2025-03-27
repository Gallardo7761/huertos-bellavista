import React, { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const NavListaEspera = () => {
  const [showing, setShowing] = useState(false);

  return (
    <NavDropdown
      title={<><FontAwesomeIcon icon={faList} className="me-2" />Lista de espera</>}
      id="nav-lista-espera"
      show={showing}
      onMouseEnter={() => setShowing(true)}
      onMouseLeave={() => setShowing(false)}
      onToggle={(isOpen) => setShowing(isOpen)}
    >
      <NavDropdown.Item as={Link} to="/lista-espera">
        <FontAwesomeIcon icon={faEye} className="me-2" />Ver la lista
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/alta">
        <FontAwesomeIcon icon={faPlus} className="me-2" />Solicitar huerto
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default NavListaEspera;

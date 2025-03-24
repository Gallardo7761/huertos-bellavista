import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const NavListaEspera = () => {
  return (
    <li className="nav-item dropdown" id="nav-lista-espera">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="dropdownListaEspera"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Lista de espera"
      >
        <FontAwesomeIcon icon={faList} className="me-2" />Lista de espera
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdownListaEspera">
        <li>
          <Link className="dropdown-item" to="/lista-espera" title="Ver lista de espera">
            <FontAwesomeIcon icon={faEye} className="me-2" />Ver la lista
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/alta" title="Solicitar huerto">
            <FontAwesomeIcon icon={faPlus} className="me-2" />Solicitar huerto
          </Link>
        </li>
      </ul>
    </li>
  );
};

export default NavListaEspera;
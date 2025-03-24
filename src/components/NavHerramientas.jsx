import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBullhorn, faFile, faConciergeBell } from '@fortawesome/free-solid-svg-icons';

const NavHerramientas = () => {
  return (
    <li className="nav-item dropdown" id="nav-herramientas">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="dropdownHerramientas"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Herramientas"
      >
        <FontAwesomeIcon icon={faTools} className="me-2" />Herramientas
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdownHerramientas">
        <li>
          <Link className="dropdown-item" to="/anuncios" title="Anuncios">
            <FontAwesomeIcon icon={faBullhorn} className="me-2" />Anuncios
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/documentacion" title="Documentación">
            <FontAwesomeIcon icon={faFile} className="me-2" />Documentación
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/solicitud" title="Solicitud">
            <FontAwesomeIcon icon={faConciergeBell} className="me-2" />Enviar una solicitud
          </Link>
        </li>
      </ul>
    </li>
  );
};

export default NavHerramientas;
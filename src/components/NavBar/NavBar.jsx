import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignIn,
  faSignOut
} from '@fortawesome/free-solid-svg-icons';

import '../../css/NavBar.css';

import NavHome from './NavHome';
import NavListaEspera from './NavListaEspera';
import NavHerramientas from './NavHerramientas';
import NavGestion from './NavGestion';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <nav className={`navbar navbar-expand-lg sticky-top shadow px-3 rounded-bottom-4 ${theme}`}>
      <div className="container-fluid d-flex justify-content-between p-0">
        {/* Logo a la izquierda */}
        <Link className="navbar-brand ms-1" id="nav-username" to="/perfil"></Link>

        {/* Botón de menú */}
        <button
          className="navbar-toggler collapsed custom-hamburger"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse"
          aria-controls="collapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="navbar-collapse collapse" id="collapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0 m-0 p-2 gap-2">
            <NavHome />
            <NavListaEspera />
            <NavHerramientas />
            <NavGestion />
          </ul>
          <hr className="m-0 p-0 mt-2 mb-2" />

          {/* Login */}
          <ul className="navbar-nav d-flex flex-md-none mb-2 mb-md-0 m-0 p-2 gap-2">
            <li className="nav-item" id="nav-login">
              <Link className="nav-link" to="/login" title="Iniciar sesión">
                <FontAwesomeIcon icon={faSignIn} className="me-2" />Iniciar sesión
              </Link>
            </li>
            <li className="nav-item" id="nav-logout">
              <a className="nav-link" href="#" title="Cerrar sesión">
                <FontAwesomeIcon icon={faSignOut} className="me-2" />Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

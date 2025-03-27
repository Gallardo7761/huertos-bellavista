import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
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

import IfAuthenticated from '../Auth/IfAuthenticated.jsx';
import IfNotAuthenticated from '../Auth/IfNotAuthenticated.jsx';
import IfRole from '../Auth/IfRole.jsx';

import { Navbar, Nav, Container } from 'react-bootstrap';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const collapse = document.querySelector(".navbar-collapse");
    if (collapse?.classList.contains("show")) {
      collapse.classList.remove("show");
    }
  }, [location.pathname]);

  return (
    <Navbar expand="lg" sticky="top">
      <Container fluid>
        {/* Usuario (izquierda) */}
        <IfAuthenticated>
          <Navbar.Brand as={Link} to="/perfil" className="fw-bold">
            @{user?.usuario}
          </Navbar.Brand>
        </IfAuthenticated>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="main-navbar" className="custom-hamburger" />

        {/* Contenido del navbar */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto gap-2">
            <NavHome />
            <NavListaEspera />
            <NavHerramientas />
            <IfRole roles={["admin", "dev"]}>
              <NavGestion />
            </IfRole>
          </Nav>

          {/* Login / Logout */}
          <Nav className="d-flex flex-md-row flex-column gap-2 ms-auto">
            <IfNotAuthenticated>
              <Nav.Link as={Link} to="/login" title="Iniciar sesión">
                <FontAwesomeIcon icon={faSignIn} className="me-2" />
                Iniciar sesión
              </Nav.Link>
            </IfNotAuthenticated>

            <IfAuthenticated>
              <Nav.Link onClick={logout} title="Cerrar sesión">
                <FontAwesomeIcon icon={faSignOut} className="me-2" />
                Cerrar sesión
              </Nav.Link>
            </IfAuthenticated>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

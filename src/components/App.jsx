import Header from './Header'
import NavBar from './NavBar/NavBar'
import Footer from './Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute.jsx'
import useSessionRenewal from '../hooks/useSessionRenewal'

import Home from '../pages/Home'
import Socios from '../pages/Socios'
import Ingresos from '../pages/Ingresos'
import Gastos from '../pages/Gastos'
import Balance from '../pages/Balance'
import Login from '../pages/Login'
import Solicitudes from '../pages/Solicitudes'
import Anuncios from '../pages/Anuncios'
import ListaEspera from '../pages/ListaEspera'
import Building from '../pages/Building'
import Documentacion from '../pages/Documentacion'

import { CONSTANTS } from '../util/constants'
import Perfil from '../pages/Perfil.jsx'
import Correo from '../pages/Correo.jsx'

function App() {
  const { modal: sessionModal } = useSessionRenewal();
  const routesWithFooter = ["/", "/lista-espera", "/login", "/gestion/socios", "/gestion/ingresos", "/gestion/gastos", "/gestion/balance"];

  return (
    <>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lista-espera" element={<ListaEspera />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestion/socios" element={
          <ProtectedRoute minimumRole={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <Socios />
          </ProtectedRoute>
        } />
        <Route path="/gestion/ingresos" element={
          <ProtectedRoute minimumRole={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <Ingresos />
          </ProtectedRoute>
        } />
        <Route path="/gestion/gastos" element={
          <ProtectedRoute minimumRole={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <Gastos />
          </ProtectedRoute>
        } />
        <Route path="/gestion/balance" element={
          <ProtectedRoute minimumRole={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <Balance />
          </ProtectedRoute>
        } />
        <Route path="/documentacion" element={
          <ProtectedRoute>
            <Documentacion />
          </ProtectedRoute>
        } />
        <Route path="/anuncios" element={
          <ProtectedRoute>
            <Anuncios />
          </ProtectedRoute>
        } />
        <Route path="/gestion/solicitudes" element={
          <ProtectedRoute minimumRole={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <Solicitudes />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        <Route path="/correo" element={
          <ProtectedRoute>
            <Correo />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<Building />} />
      </Routes>
      {routesWithFooter.includes(useLocation().pathname) ? <Footer /> : null}
      {sessionModal}
    </>
  )
}

export default App

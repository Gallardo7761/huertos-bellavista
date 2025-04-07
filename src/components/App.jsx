import ThemeButton from './ThemeButton'
import Header from './Header'
import NavBar from './NavBar/NavBar'
import Footer from './Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './Auth/ProtectedRoute.jsx'

import Home from '../pages/Home'
import Socios from '../pages/Socios'
import Ingresos from '../pages/Ingresos'
import Gastos from '../pages/Gastos'
import Balance from '../pages/Balance'
import Login from '../pages/Login'
import SolicitarHuerto from '../pages/SolicitarHuerto'
import SolicitudesAlta from '../pages/SolicitudesAlta'
import SolicitudesInverColab from '../pages/SolicitudesInverColab'
import Anuncios from '../pages/Anuncios'
import ListaEspera from '../pages/ListaEspera'
import Building from '../pages/Building'

function App() {

  const routesWithFooter = ["/", "/lista-espera", "/login", "/gestion/socios"];

  return (
    <>
      <Header />
      <NavBar />
      {/**<Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestion/socios" element={<Socios />} />
        <Route path="/gestion/gastos" element={<Gastos />} />
        <Route path="/gestion/balance" element={<Balance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/solicitar-huerto" element={<SolicitarHuerto />} />
        <Route path="/solicitudes-alta" element={<SolicitudesAlta />} />
        <Route path="/solicitudes-invernadero-colaborador" element={<SolicitudesInverColab />} />
        <Route path="/anuncios" element={<Anuncios />} />
        <Route path="/lista-espera" element={<ListaEspera />} />
      </Routes> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lista-espera" element={<ListaEspera />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestion/socios" element={
          <ProtectedRoute>
            <Socios />
          </ProtectedRoute>
        } />
        <Route path="/gestion/ingresos" element={
          <ProtectedRoute>
            <Ingresos />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<Building />} />
      </Routes>
      {routesWithFooter.includes(useLocation().pathname) ? <Footer /> : null}
    </>
  )
}

export default App

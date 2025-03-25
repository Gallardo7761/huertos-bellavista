import '../css/App.css'

import ThemeButton from './ThemeButton'
import Header from './Header'
import NavBar from './NavBar/NavBar'
import Footer from './Footer'
import { Route, Routes } from 'react-router-dom'

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

function App() {

  return (
    <>
      <ThemeButton />
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/solicitar-huerto" element={<SolicitarHuerto />} />
        <Route path="/solicitudes-alta" element={<SolicitudesAlta />} />
        <Route path="/solicitudes-invernadero-colaborador" element={<SolicitudesInverColab />} />
        <Route path="/anuncios" element={<Anuncios />} />
        <Route path="/lista-espera" element={<ListaEspera />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

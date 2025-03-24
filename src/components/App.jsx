import '../css/App.css'

import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'

function App() {

  return (
    <>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

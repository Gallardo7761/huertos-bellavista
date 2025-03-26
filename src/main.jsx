import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* COMPONENTS */
import App from './components/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ConfigProvider } from './context/ConfigContext'
import { AuthProvider } from './context/AuthContext'

/* CSS */
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
        <ConfigProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ConfigProvider>
      </ThemeProvider>
  </StrictMode>,
)

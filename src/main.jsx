import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AlertProvider } from "./components/AlertModal/AlertContext.jsx";
import  AuthProvider  from "./auth/AuthContext"
import Approutes from './routes/Approutes.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <Approutes />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

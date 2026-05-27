// src/pages/Login.jsx
import { useEffect } from 'react'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../config/authConfig'
import './Login.css'

export default function Login() {
  const { instance } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error)
  }

  return (
    <div className="login-page">
      <div className="login-bg-lines" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="login-line" style={{ '--i': i }} />
        ))}
      </div>

      <div className="login-card fade-in">
        <div className="login-logo">◈</div>
        <h1 className="login-title">Gestor de<br />Datos Personales</h1>
        <p className="login-subtitle">
          Diseño de Software II — Universidad del Norte
        </p>

        <div className="login-divider" />

        <p className="login-instruction">
          Inicia sesión con tu cuenta institucional de Microsoft
        </p>

        <button className="login-btn" onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1h10v10H1z" fill="#f25022"/>
            <path d="M12 1h10v10H12z" fill="#7fba00"/>
            <path d="M1 12h10v10H1z"  fill="#00a4ef"/>
            <path d="M12 12h10v10H12z" fill="#ffb900"/>
          </svg>
          Iniciar sesión con Microsoft
        </button>

        <p className="login-footer">
          Acceso restringido a usuarios autorizados
        </p>
      </div>
    </div>
  )
}

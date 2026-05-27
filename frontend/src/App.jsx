// src/App.jsx
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { setupInterceptors } from './services/api'
import { loginRequest } from './config/authConfig'

import Login            from './pages/Login'
import Layout           from './components/Layout'
import Menu             from './pages/Menu'
import CrearPersona     from './pages/CrearPersona'
import ConsultarPersona from './pages/ConsultarPersona'
import ModificarPersona from './pages/ModificarPersona'
import BorrarPersona    from './pages/BorrarPersona'
import ConsultarLog     from './pages/ConsultarLog'

function AuthGuard({ children }) {
  const isAuthenticated = useIsAuthenticated()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { instance } = useMsal()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    instance.handleRedirectPromise()
      .then(() => {
        setupInterceptors(instance, loginRequest)
        setReady(true)
      })
      .catch((e) => {
        console.error(e)
        setReady(true)
      })
  }, [instance])

  if (!ready) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Menu />} />
          <Route path="crear"     element={<CrearPersona />} />
          <Route path="consultar" element={<ConsultarPersona />} />
          <Route path="modificar" element={<ModificarPersona />} />
          <Route path="borrar"    element={<BorrarPersona />} />
          <Route path="log"       element={<ConsultarLog />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
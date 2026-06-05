// src/services/api.js
import axios from 'axios'
import { gatewayUrl } from '../config/authConfig'

// Instancia base — el token se inyecta por interceptor antes de cada petición
const api = axios.create({
  baseURL: gatewayUrl,
  timeout: 15000,
})

// Función que debe llamarse con la instancia de MSAL para inyectar tokens
export function setupInterceptors(msalInstance, loginRequest) {
  api.interceptors.request.use(async (config) => {
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length === 0) return config

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      config.headers.Authorization = `Bearer ${response.accessToken}`
    } catch {
      // Si el silent falla, fuerza login interactivo
      await msalInstance.acquireTokenRedirect(loginRequest)
    }
    return config
  })
}

// ─── Personas ───────────────────────────────────────────────────────────────

export const crearPersona = (formData) =>
  api.post('/personas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const consultarPersona = (nroDocumento) =>
  api.get(`/personas/consultar/${nroDocumento}`)

export const modificarPersona = (nroDocumento, data) =>
  api.put(`/personas/modificar/${nroDocumento}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const obtenerPersonaParaBorrar = (nroDocumento) =>
  api.get(`/personas/borrar/${nroDocumento}`)

export const borrarPersona = (nroDocumento) =>
  api.delete(`/personas/borrar/${nroDocumento}`)

// ─── Log ────────────────────────────────────────────────────────────────────

export const consultarLog = (params) =>
  api.get('/log', { params })

export default api

// src/pages/ConsultarPersona.jsx
import { useState } from 'react'
import { consultarPersona } from '../services/api'
import { validarNroDocumento } from '../utils/validations'

export default function ConsultarPersona() {
  const [doc, setDoc]       = useState('')
  const [docError, setDocError] = useState(null)
  const [persona, setPersona]   = useState(null)
  const [estado, setEstado]     = useState(null) // null | 'loading' | 'ok' | 'error' | 'notfound' | 'unavailable'
  const [mensaje, setMensaje]   = useState('')

  const handleBuscar = async (e) => {
    e.preventDefault()
    const err = validarNroDocumento(doc)
    if (err) { setDocError(err); return }
    setDocError(null)
    setEstado('loading')
    setPersona(null)

    try {
      const res = await consultarPersona(doc)
      setPersona(res.data)
      setEstado('ok')
    } catch (err) {
      const status = err.response?.status
      if (status === 404) {
        setEstado('notfound')
        setMensaje(`No se encontró ninguna persona con documento ${doc}.`)
      } else if (status === 503) {
        setEstado('unavailable')
        setMensaje('El servicio de consulta está temporalmente deshabilitado.')
      } else {
        setEstado('error')
        setMensaje('Error al consultar. Intenta de nuevo.')
      }
    }
  }

  const handleNueva = () => {
    setDoc('')
    setPersona(null)
    setEstado(null)
    setMensaje('')
  }

  const CAMPOS = [
    ['Tipo de documento',   'tipo_documento'],
    ['Número de documento', 'nro_documento'],
    ['Primer nombre',       'primer_nombre'],
    ['Segundo nombre',      'segundo_nombre'],
    ['Apellidos',           'apellidos'],
    ['Fecha de nacimiento', 'fecha_nacimiento'],
    ['Género',              'genero'],
    ['Correo electrónico',  'correo_electronico'],
    ['Celular',             'celular'],
  ]

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Consultar persona</h1>
        <p className="page-subtitle">Busca los datos de una persona por número de documento.</p>
      </div>

      <form className="card-sm" onSubmit={handleBuscar} noValidate style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Número de documento</label>
            <input
              type="text"
              className={`form-input ${docError ? 'error' : ''}`}
              value={doc}
              onChange={(e) => { setDoc(e.target.value); setDocError(null) }}
              maxLength={10}
              placeholder="Ingresa el número de documento"
            />
            {docError && <span className="form-error">✕ {docError}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={estado === 'loading'}
            style={{ marginBottom: docError ? 22 : 0 }}
          >
            {estado === 'loading' ? <><span className="spinner" /> Buscando…</> : 'Buscar'}
          </button>
        </div>
      </form>

      {(estado === 'notfound' || estado === 'error') && (
        <div className="alert alert-error">
          <span>✕</span><span>{mensaje}</span>
        </div>
      )}

      {estado === 'unavailable' && (
        <div className="alert alert-warning">
          <span>⚠</span><span>{mensaje}</span>
        </div>
      )}

      {estado === 'ok' && persona && (
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
              {persona.primer_nombre} {persona.segundo_nombre} {persona.apellidos}
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={handleNueva}>Nueva consulta</button>
          </div>

          {persona.foto_path && (
            <div style={{ marginBottom: 20 }}>
              <img
                src={`/api/uploads/${persona.foto_path}`}
                alt="Foto"
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
              />
            </div>
          )}

          {CAMPOS.map(([label, key]) => (
            <div className="data-row" key={key}>
              <span className="data-label">{label}</span>
              <span className="data-value">{persona[key] || '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

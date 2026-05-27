// src/pages/BorrarPersona.jsx
import { useState } from 'react'
import { obtenerPersonaParaBorrar, borrarPersona } from '../services/api'
import { validarNroDocumento } from '../utils/validations'

export default function BorrarPersona() {
  const [doc, setDoc]         = useState('')
  const [docError, setDocError] = useState(null)
  const [persona, setPersona] = useState(null)
  const [estado, setEstado]   = useState(null) // null | 'searching' | 'confirm' | 'deleting' | 'ok' | 'error' | 'notfound'
  const [mensaje, setMensaje] = useState('')

  const handleBuscar = async (e) => {
    e.preventDefault()
    const err = validarNroDocumento(doc)
    if (err) { setDocError(err); return }
    setDocError(null)
    setEstado('searching')
    setPersona(null)

    try {
      const res = await obtenerPersonaParaBorrar(doc)
      setPersona(res.data)
      setEstado('confirm')
    } catch (err) {
      const status = err.response?.status
      if (status === 404) {
        setEstado('notfound')
        setMensaje(`No se encontró ninguna persona con documento ${doc}.`)
      } else {
        setEstado('error')
        setMensaje('Error al buscar la persona.')
      }
    }
  }

  const handleConfirmar = async () => {
    setEstado('deleting')
    try {
      await borrarPersona(doc)
      setEstado('ok')
      setMensaje(`La persona con documento ${doc} fue eliminada correctamente.`)
      setPersona(null)
    } catch (err) {
      setEstado('error')
      setMensaje(err.response?.status === 404 ? 'Persona no encontrada.' : 'Error al eliminar.')
    }
  }

  const handleNueva = () => {
    setDoc(''); setPersona(null); setEstado(null); setMensaje('')
  }

  const CAMPOS = [
    ['Nombre completo', null, (p) => `${p.primer_nombre} ${p.segundo_nombre || ''} ${p.apellidos}`.trim()],
    ['Tipo de documento', 'tipo_documento', null],
    ['Correo electrónico', 'correo_electronico', null],
    ['Celular', 'celular', null],
    ['Género', 'genero', null],
  ]

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Eliminar persona</h1>
        <p className="page-subtitle">Esta acción es permanente. Revisa los datos antes de confirmar.</p>
      </div>

      {/* Búsqueda */}
      {estado !== 'ok' && (
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
                disabled={estado === 'confirm' || estado === 'deleting'}
              />
              {docError && <span className="form-error">✕ {docError}</span>}
            </div>
            {estado !== 'confirm' && estado !== 'deleting' && (
              <button type="submit" className="btn btn-primary" disabled={estado === 'searching'}
                style={{ marginBottom: docError ? 22 : 0 }}>
                {estado === 'searching' ? <><span className="spinner" /> Buscando…</> : 'Buscar'}
              </button>
            )}
            {(estado === 'confirm' || estado === 'deleting') && (
              <button type="button" className="btn btn-ghost" onClick={handleNueva}
                style={{ marginBottom: 0 }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {(estado === 'notfound' || (estado === 'error' && !persona)) && (
        <div className="alert alert-error"><span>✕</span><span>{mensaje}</span></div>
      )}

      {estado === 'ok' && (
        <div className="alert alert-success">
          <span>✓</span>
          <div>{mensaje}
            <button className="btn btn-sm btn-ghost" onClick={handleNueva} style={{ marginLeft: 12 }}>
              Nueva búsqueda
            </button>
          </div>
        </div>
      )}

      {/* Confirmación */}
      {persona && (estado === 'confirm' || estado === 'deleting') && (
        <div className="card fade-in" style={{ borderColor: 'var(--color-error)', borderWidth: 1.5 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20, padding: '12px 16px', background: 'var(--color-error-bg)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--color-error)' }}>⚠</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-error)', marginBottom: 4 }}>
                ¿Confirmas la eliminación?
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Esta acción no se puede deshacer. El registro será eliminado permanentemente.
              </div>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 16, color: 'var(--color-text-muted)' }}>
            Datos de la persona a eliminar
          </h3>

          {CAMPOS.map(([label, key, fn]) => (
            <div className="data-row" key={label}>
              <span className="data-label">{label}</span>
              <span className="data-value">{fn ? fn(persona) : persona[key] || '—'}</span>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmar}
              disabled={estado === 'deleting'}
            >
              {estado === 'deleting'
                ? <><span className="spinner" /> Eliminando…</>
                : 'Sí, eliminar persona'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleNueva}>
              No, cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

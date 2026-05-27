// src/pages/ModificarPersona.jsx
import { useState } from 'react'
import { consultarPersona, modificarPersona } from '../services/api'
import { validarNroDocumento, validarFormularioPersona, GENEROS } from '../utils/validations'

export default function ModificarPersona() {
  const [doc, setDoc]         = useState('')
  const [docError, setDocError] = useState(null)
  const [form, setForm]       = useState(null)
  const [errores, setErrores] = useState({})
  const [estado, setEstado]   = useState(null) // null | 'searching' | 'found' | 'saving' | 'ok' | 'error' | 'notfound'
  const [mensaje, setMensaje] = useState('')

  const handleBuscar = async (e) => {
    e.preventDefault()
    const err = validarNroDocumento(doc)
    if (err) { setDocError(err); return }
    setDocError(null)
    setEstado('searching')
    setForm(null)

    try {
      const res = await consultarPersona(doc)
      setForm({ ...res.data, foto: null })
      setEstado('found')
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

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    const erroresNuevos = validarFormularioPersona(form, true)
    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos)
      return
    }

    setEstado('saving')
    try {
      const formData = new FormData()
      const camposEditables = ['primer_nombre','segundo_nombre','apellidos','correo_electronico','celular','foto']
      camposEditables.forEach((key) => {
        if (form[key] !== null && form[key] !== '') formData.append(key, form[key])
      })

      await modificarPersona(doc, formData)
      setEstado('ok')
      setMensaje('Persona actualizada exitosamente.')
    } catch (err) {
      setEstado('error')
      const status = err.response?.status
      setMensaje(status === 404 ? 'Persona no encontrada.' : 'Error al guardar los cambios.')
    }
  }

  const handleNueva = () => {
    setDoc(''); setForm(null); setEstado(null); setMensaje(''); setErrores({})
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Modificar persona</h1>
        <p className="page-subtitle">Busca por número de documento y edita los datos.</p>
      </div>

      {/* Paso 1: búsqueda */}
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
                disabled={estado === 'found' || estado === 'saving'}
              />
              {docError && <span className="form-error">✕ {docError}</span>}
            </div>
            {estado !== 'found' && estado !== 'saving' && (
              <button type="submit" className="btn btn-primary" disabled={estado === 'searching'}
                style={{ marginBottom: docError ? 22 : 0 }}>
                {estado === 'searching' ? <><span className="spinner" /> Buscando…</> : 'Buscar'}
              </button>
            )}
            {(estado === 'found' || estado === 'saving') && (
              <button type="button" className="btn btn-ghost" onClick={handleNueva}
                style={{ marginBottom: 0 }}>
                Cambiar
              </button>
            )}
          </div>
        </form>
      )}

      {(estado === 'notfound' || (estado === 'error' && !form)) && (
        <div className="alert alert-error"><span>✕</span><span>{mensaje}</span></div>
      )}

      {estado === 'ok' && (
        <div className="alert alert-success">
          <span>✓</span>
          <div>{mensaje}
            <button className="btn btn-sm btn-ghost" onClick={handleNueva} style={{ marginLeft: 12 }}>
              Modificar otra
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: formulario de edición */}
      {form && estado !== 'ok' && (
        <form className="card fade-in" onSubmit={handleGuardar} noValidate>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            Editando documento <strong style={{ color: 'var(--color-text)' }}>{doc}</strong>.
            Los campos de documento, fecha y género no se pueden modificar.
          </p>

          {estado === 'error' && (
            <div className="alert alert-error"><span>✕</span><span>{mensaje}</span></div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Primer nombre <span className="required">*</span></label>
              <input type="text" name="primer_nombre"
                className={`form-input ${errores.primer_nombre ? 'error' : ''}`}
                value={form.primer_nombre} onChange={handleChange} maxLength={30} />
              {errores.primer_nombre && <span className="form-error">✕ {errores.primer_nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Segundo nombre</label>
              <input type="text" name="segundo_nombre"
                className={`form-input ${errores.segundo_nombre ? 'error' : ''}`}
                value={form.segundo_nombre || ''} onChange={handleChange} maxLength={30} />
              {errores.segundo_nombre && <span className="form-error">✕ {errores.segundo_nombre}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Apellidos <span className="required">*</span></label>
              <input type="text" name="apellidos"
                className={`form-input ${errores.apellidos ? 'error' : ''}`}
                value={form.apellidos} onChange={handleChange} maxLength={60} />
              {errores.apellidos && <span className="form-error">✕ {errores.apellidos}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico <span className="required">*</span></label>
              <input type="email" name="correo_electronico"
                className={`form-input ${errores.correo_electronico ? 'error' : ''}`}
                value={form.correo_electronico} onChange={handleChange} />
              {errores.correo_electronico && <span className="form-error">✕ {errores.correo_electronico}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Celular <span className="required">*</span></label>
              <input type="text" name="celular"
                className={`form-input ${errores.celular ? 'error' : ''}`}
                value={form.celular} onChange={handleChange} maxLength={10} />
              {errores.celular && <span className="form-error">✕ {errores.celular}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nueva foto (máx. 2 MB)</label>
              <input type="file" name="foto"
                className={`form-input ${errores.foto ? 'error' : ''}`}
                accept="image/*" onChange={handleChange} />
              {errores.foto && <span className="form-error">✕ {errores.foto}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={estado === 'saving'}>
              {estado === 'saving' ? <><span className="spinner" /> Guardando…</> : 'Guardar cambios'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleNueva}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

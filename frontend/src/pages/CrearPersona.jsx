// src/pages/CrearPersona.jsx
import { useState } from 'react'
import { crearPersona } from '../services/api'
import {
  TIPOS_DOCUMENTO, GENEROS,
  validarFormularioPersona
} from '../utils/validations'

const INITIAL = {
  nro_documento: '',
  tipo_documento: '',
  primer_nombre: '',
  segundo_nombre: '',
  apellidos: '',
  fecha_nacimiento: '',
  genero: '',
  correo_electronico: '',
  celular: '',
  foto: null,
}

export default function CrearPersona() {
  const [form, setForm]       = useState(INITIAL)
  const [errores, setErrores] = useState({})
  const [estado, setEstado]   = useState(null) // null | 'loading' | 'ok' | 'error'
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
    // Limpiar error del campo al editarlo
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const erroresNuevos = validarFormularioPersona(form)
    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos)
      return
    }

    setEstado('loading')

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== '') formData.append(key, val)
      })

      await crearPersona(formData)
      setEstado('ok')
      setMensaje('Persona registrada exitosamente.')
      setForm(INITIAL)
      setErrores({})
    } catch (err) {
      setEstado('error')
      const status = err.response?.status
      if (status === 409) {
        setMensaje('Ya existe una persona con ese número de documento.')
      } else if (status === 400) {
        setMensaje(err.response?.data?.message || 'Datos inválidos.')
      } else {
        setMensaje('Error al registrar la persona. Intenta de nuevo.')
      }
    }
  }

  const handleNuevo = () => {
    setEstado(null)
    setMensaje('')
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Crear persona</h1>
        <p className="page-subtitle">Registra una nueva persona en el sistema.</p>
      </div>

      {estado === 'ok' && (
        <div className="alert alert-success">
          <span>✓</span>
          <div>
            {mensaje}
            <button className="btn btn-sm btn-ghost" onClick={handleNuevo} style={{ marginLeft: 12 }}>
              Registrar otra
            </button>
          </div>
        </div>
      )}

      {estado === 'error' && (
        <div className="alert alert-error">
          <span>✕</span>
          <span>{mensaje}</span>
        </div>
      )}

      {estado !== 'ok' && (
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24, color: 'var(--color-text-muted)' }}>
            Datos del documento
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Tipo de documento <span className="required">*</span>
              </label>
              <select
                name="tipo_documento"
                className={`form-select ${errores.tipo_documento ? 'error' : ''}`}
                value={form.tipo_documento}
                onChange={handleChange}
              >
                <option value="">Selecciona…</option>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errores.tipo_documento && <span className="form-error">✕ {errores.tipo_documento}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Número de documento <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nro_documento"
                className={`form-input ${errores.nro_documento ? 'error' : ''}`}
                value={form.nro_documento}
                onChange={handleChange}
                maxLength={10}
                placeholder="Máx. 10 dígitos"
              />
              {errores.nro_documento && <span className="form-error">✕ {errores.nro_documento}</span>}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0 24px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24, color: 'var(--color-text-muted)' }}>
            Datos personales
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Primer nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                name="primer_nombre"
                className={`form-input ${errores.primer_nombre ? 'error' : ''}`}
                value={form.primer_nombre}
                onChange={handleChange}
                maxLength={30}
              />
              {errores.primer_nombre && <span className="form-error">✕ {errores.primer_nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Segundo nombre</label>
              <input
                type="text"
                name="segundo_nombre"
                className={`form-input ${errores.segundo_nombre ? 'error' : ''}`}
                value={form.segundo_nombre}
                onChange={handleChange}
                maxLength={30}
              />
              {errores.segundo_nombre && <span className="form-error">✕ {errores.segundo_nombre}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Apellidos <span className="required">*</span>
              </label>
              <input
                type="text"
                name="apellidos"
                className={`form-input ${errores.apellidos ? 'error' : ''}`}
                value={form.apellidos}
                onChange={handleChange}
                maxLength={60}
              />
              {errores.apellidos && <span className="form-error">✕ {errores.apellidos}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Fecha de nacimiento <span className="required">*</span>
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                className={`form-input ${errores.fecha_nacimiento ? 'error' : ''}`}
                value={form.fecha_nacimiento}
                onChange={handleChange}
              />
              {errores.fecha_nacimiento && <span className="form-error">✕ {errores.fecha_nacimiento}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Género <span className="required">*</span>
              </label>
              <select
                name="genero"
                className={`form-select ${errores.genero ? 'error' : ''}`}
                value={form.genero}
                onChange={handleChange}
              >
                <option value="">Selecciona…</option>
                {GENEROS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errores.genero && <span className="form-error">✕ {errores.genero}</span>}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0 24px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24, color: 'var(--color-text-muted)' }}>
            Contacto y foto
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Correo electrónico <span className="required">*</span>
              </label>
              <input
                type="email"
                name="correo_electronico"
                className={`form-input ${errores.correo_electronico ? 'error' : ''}`}
                value={form.correo_electronico}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
              />
              {errores.correo_electronico && <span className="form-error">✕ {errores.correo_electronico}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Celular <span className="required">*</span>
              </label>
              <input
                type="text"
                name="celular"
                className={`form-input ${errores.celular ? 'error' : ''}`}
                value={form.celular}
                onChange={handleChange}
                maxLength={10}
                placeholder="10 dígitos"
              />
              {errores.celular && <span className="form-error">✕ {errores.celular}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Foto (máx. 2 MB)</label>
              <input
                type="file"
                name="foto"
                className={`form-input ${errores.foto ? 'error' : ''}`}
                accept="image/*"
                onChange={handleChange}
              />
              {errores.foto && <span className="form-error">✕ {errores.foto}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={estado === 'loading'}
            >
              {estado === 'loading' ? (
                <><span className="spinner" /> Registrando…</>
              ) : (
                'Registrar persona'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setForm(INITIAL); setErrores({}) }}
            >
              Limpiar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// src/pages/ConsultarLog.jsx
import { useState } from 'react'
import { consultarLog } from '../services/api'
import { TIPOS_OPERACION_LOG } from '../utils/validations'

const LIMIT = 10

const TIPO_COLORS = {
  CREACION:     'badge-success',
  MODIFICACION: 'badge-info',
  CONSULTA:     'badge-default',
  BORRADO:      'badge-error',
  RAG:          'badge-warning',
}

const RESULTADO_COLORS = {
  EXITO: 'badge-success',
  ERROR: 'badge-error',
}

function formatFecha(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ConsultarLog() {
  const [filtros, setFiltros] = useState({
    tipo_operacion: '',
    nro_documento: '',
    fecha_desde: '',
    fecha_hasta: '',
  })
  const [registros, setRegistros]   = useState([])
  const [total, setTotal]           = useState(0)
  const [pagina, setPagina]         = useState(1)
  const [estado, setEstado]         = useState(null) // null | 'loading' | 'ok' | 'error'
  const [mensaje, setMensaje]       = useState('')

  const totalPaginas = Math.ceil(total / LIMIT)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const cargar = async (pg = 1) => {
    setEstado('loading')
    setPagina(pg)

    try {
      const params = { page: pg, limit: LIMIT }
      if (filtros.tipo_operacion) params.tipo_operacion = filtros.tipo_operacion
      if (filtros.nro_documento)  params.nro_documento  = filtros.nro_documento
      if (filtros.fecha_desde)    params.fecha_desde    = filtros.fecha_desde
      if (filtros.fecha_hasta)    params.fecha_hasta    = filtros.fecha_hasta

      const res = await consultarLog(params)
      setRegistros(res.data.registros || res.data.data || [])
      setTotal(res.data.total || 0)
      setEstado('ok')
    } catch {
      setEstado('error')
      setMensaje('Error al consultar el log. Intenta de nuevo.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    cargar(1)
  }

  const handleLimpiar = () => {
    setFiltros({ tipo_operacion: '', nro_documento: '', fecha_desde: '', fecha_hasta: '' })
    setRegistros([])
    setTotal(0)
    setEstado(null)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Consultar log</h1>
        <p className="page-subtitle">Historial de todas las transacciones del sistema.</p>
      </div>

      {/* Filtros */}
      <form className="card-sm" onSubmit={handleSubmit} noValidate style={{ marginBottom: 24 }}>
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tipo de operación</label>
            <select name="tipo_operacion" className="form-select" value={filtros.tipo_operacion} onChange={handleChange}>
              <option value="">Todas</option>
              {TIPOS_OPERACION_LOG.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Número de documento</label>
            <input type="text" name="nro_documento" className="form-input"
              value={filtros.nro_documento} onChange={handleChange}
              placeholder="Opcional" maxLength={10} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fecha desde</label>
            <input type="date" name="fecha_desde" className="form-input"
              value={filtros.fecha_desde} onChange={handleChange} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fecha hasta</label>
            <input type="date" name="fecha_hasta" className="form-input"
              value={filtros.fecha_hasta} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={estado === 'loading'}>
            {estado === 'loading' ? <><span className="spinner" /> Cargando…</> : 'Consultar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleLimpiar}>
            Limpiar
          </button>
        </div>
      </form>

      {estado === 'error' && (
        <div className="alert alert-error"><span>✕</span><span>{mensaje}</span></div>
      )}

      {/* Resultados */}
      {estado === 'ok' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {total === 0
                ? 'Sin resultados para los filtros aplicados.'
                : `Mostrando ${(pagina - 1) * LIMIT + 1}–${Math.min(pagina * LIMIT, total)} de ${total} registros`}
            </span>
          </div>

          {total > 0 && (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha / hora</th>
                      <th>Operación</th>
                      <th>Documento</th>
                      <th>Resultado</th>
                      <th>Usuario</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((r) => (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--color-text-muted)' }}>{r.id}</td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          {formatFecha(r.fecha_hora)}
                        </td>
                        <td>
                          <span className={`badge ${TIPO_COLORS[r.tipo_operacion] || 'badge-default'}`}>
                            {r.tipo_operacion}
                          </span>
                        </td>
                        <td>{r.nro_documento || '—'}</td>
                        <td>
                          <span className={`badge ${RESULTADO_COLORS[r.resultado] || 'badge-default'}`}>
                            {r.resultado}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.usuario || '—'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: 200 }}>
                          {r.detalle || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => cargar(pagina - 1)} disabled={pagina === 1}>
                    ‹
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`e${i}`} style={{ color: 'var(--color-text-dim)', padding: '0 4px' }}>…</span>
                      ) : (
                        <button key={p} className={`page-btn ${p === pagina ? 'active' : ''}`} onClick={() => cargar(p)}>
                          {p}
                        </button>
                      )
                    )}

                  <button className="page-btn" onClick={() => cargar(pagina + 1)} disabled={pagina === totalPaginas}>
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

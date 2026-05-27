// src/components/Layout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { n8nChatUrl } from '../config/authConfig'
import './Layout.css'

const NAV_ITEMS = [
  { to: '/',          label: 'Inicio',            icon: '⌂',  end: true },
  { to: '/crear',     label: 'Crear persona',      icon: '＋' },
  { to: '/consultar', label: 'Consultar persona',  icon: '◎' },
  { to: '/modificar', label: 'Modificar persona',  icon: '✎' },
  { to: '/borrar',    label: 'Eliminar persona',   icon: '✕' },
  { to: '/log',       label: 'Consultar log',      icon: '≡' },
]

export default function Layout() {
  const { instance, accounts } = useMsal()
  const navigate = useNavigate()
  const user = accounts[0]

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: '/login' })
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">◈</span>
          <div>
            <div className="brand-name">Gestor</div>
            <div className="brand-sub">Datos Personales</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}

          {/* Enlace externo a n8n */}
          <a
            href={n8nChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item nav-item--external"
          >
            <span className="nav-icon">✦</span>
            <span className="nav-label">Consulta natural</span>
            <span className="nav-ext-badge">↗</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="user-details">
                <div className="user-name">{user.name || 'Usuario'}</div>
                <div className="user-email">{user.username}</div>
              </div>
            </div>
          )}
          <button className="btn btn-ghost btn-sm logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

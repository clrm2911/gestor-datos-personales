// src/pages/Menu.jsx
import { Link } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { n8nChatUrl } from '../config/authConfig'
import './Menu.css'

const CARDS = [
  {
    to: '/crear',
    icon: '＋',
    label: 'Crear persona',
    desc: 'Registra una nueva persona con todos sus datos personales.',
    color: 'green',
  },
  {
    to: '/consultar',
    icon: '◎',
    label: 'Consultar persona',
    desc: 'Busca los datos de una persona por número de documento.',
    color: 'blue',
  },
  {
    to: '/modificar',
    icon: '✎',
    label: 'Modificar persona',
    desc: 'Actualiza los datos de una persona ya registrada.',
    color: 'amber',
  },
  {
    to: '/borrar',
    icon: '✕',
    label: 'Eliminar persona',
    desc: 'Elimina el registro de una persona previa confirmación.',
    color: 'red',
  },
  {
    to: '/log',
    icon: '≡',
    label: 'Consultar log',
    desc: 'Revisa el historial de todas las transacciones del sistema.',
    color: 'purple',
  },
  {
    href: n8nChatUrl,
    icon: '✦',
    label: 'Consulta natural',
    desc: 'Haz preguntas en lenguaje natural sobre los datos registrados.',
    color: 'teal',
    external: true,
  },
]

export default function Menu() {
  const { accounts } = useMsal()
  const user = accounts[0]

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="menu-page fade-in">
      <div className="menu-header">
        <h1 className="page-title">
          {greeting}, {user?.name?.split(' ')[0] || 'usuario'}.
        </h1>
        <p className="page-subtitle">
          ¿Qué deseas hacer hoy? Selecciona una operación.
        </p>
      </div>

      <div className="menu-grid">
        {CARDS.map((card) =>
          card.external ? (
            <a
              key={card.label}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`menu-card menu-card--${card.color}`}
            >
              <span className="menu-card-icon">{card.icon}</span>
              <span className="menu-card-label">{card.label}</span>
              <span className="menu-card-desc">{card.desc}</span>
              <span className="menu-card-arrow">↗</span>
            </a>
          ) : (
            <Link key={card.label} to={card.to} className={`menu-card menu-card--${card.color}`}>
              <span className="menu-card-icon">{card.icon}</span>
              <span className="menu-card-label">{card.label}</span>
              <span className="menu-card-desc">{card.desc}</span>
              <span className="menu-card-arrow">→</span>
            </Link>
          )
        )}
      </div>
    </div>
  )
}

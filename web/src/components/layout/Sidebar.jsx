import './sidebar.css'

import { NavLink } from 'react-router-dom'

const enlaces = [
  { to: '/', label: 'Inicio', icono: 'home' },
  { to: '/peliculas', label: 'Películas', icono: 'movie' },
  { to: '/series', label: 'Series', icono: 'tv' },
]

// Panel lateral flotante, siempre visible: colapsado con iconos y expandido al hover.
export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menú lateral">
      <div className="sidebar__perfil">
        <span className="material-icons sidebar__avatar" aria-hidden="true">
          account_circle
        </span>
        <span className="sidebar__texto">Usuario</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación">
        {enlaces.map((enlace) => (
          <NavLink key={enlace.to} to={enlace.to} className="sidebar__enlace">
            <span className="material-icons" aria-hidden="true">
              {enlace.icono}
            </span>
            <span className="sidebar__texto">{enlace.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/ajustes" className="sidebar__enlace sidebar__ajustes">
        <span className="material-icons" aria-hidden="true">
          settings
        </span>
        <span className="sidebar__texto">Ajustes</span>
      </NavLink>
    </aside>
  )
}

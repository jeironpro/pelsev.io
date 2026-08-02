import './sidebar.css'

import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/peliculas', label: 'Películas', icon: 'movie' },
  { to: '/series', label: 'Series', icon: 'tv' },
]

// Panel lateral flotante, siempre visible: colapsado con iconos y expandido al hover.
export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menú lateral">
      <div className="sidebar__profile">
        <span className="material-icons sidebar__avatar" aria-hidden="true">
          account_circle
        </span>
        <span className="sidebar__text">Usuario</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="sidebar__link">
            <span className="material-icons" aria-hidden="true">
              {link.icon}
            </span>
            <span className="sidebar__text">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/ajustes" className="sidebar__link sidebar__settings">
        <span className="material-icons" aria-hidden="true">
          settings
        </span>
        <span className="sidebar__text">Ajustes</span>
      </NavLink>
    </aside>
  )
}

import './sidebar.css'

import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/peliculas', label: 'Películas', icon: 'movie' },
  { to: '/series', label: 'Series', icon: 'tv' },
]

// Panel lateral fijo en desktop y desplegable desde la izquierda en móvil.
export default function Sidebar({ open, onClose }) {
  // Cierra el menú con Escape cuando está abierto.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      <button
        type="button"
        className={`sidebar__overlay${open ? ' sidebar__overlay--visible' : ''}`}
        onClick={onClose}
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
      />
      <aside
        className={`sidebar${open ? ' sidebar--open' : ''}`}
        aria-label="Menú lateral"
      >
        <div className="sidebar__profile">
          <span className="material-icons sidebar__avatar" aria-hidden="true">
            account_circle
          </span>
          <span className="sidebar__text">Usuario</span>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="sidebar__link"
              onClick={onClose}
            >
              <span className="material-icons" aria-hidden="true">
                {link.icon}
              </span>
              <span className="sidebar__text">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/ajustes"
          className="sidebar__link sidebar__settings"
          onClick={onClose}
        >
          <span className="material-icons" aria-hidden="true">
            settings
          </span>
          <span className="sidebar__text">Ajustes</span>
        </NavLink>
      </aside>
    </>
  )
}

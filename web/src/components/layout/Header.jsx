import './header.css'

import { NavLink } from 'react-router-dom'

// Cabecera flotante alineada con el panel lateral: logo y apertura del menú en móvil.
export default function Header({ open, onToggleMenu }) {
  return (
    <header className="header">
      <NavLink to="/" className="header__logo" aria-label="Ir al inicio">
        pelsev.io
      </NavLink>

      <button
        type="button"
        className="header__menu"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={onToggleMenu}
      >
        <span className="material-icons" aria-hidden="true">
          {open ? 'close' : 'menu'}
        </span>
      </button>
    </header>
  )
}

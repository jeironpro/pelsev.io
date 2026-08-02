import './header.css'

import { NavLink } from 'react-router-dom'

// Cabecera flotante con logo y navegación principal.
export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <NavLink to="/" className="header__logo" aria-label="Ir al inicio">
          pelsev.io
        </NavLink>
      </div>

      <nav className="header__nav" aria-label="Navegación principal">
        <NavLink to="/peliculas" className="header__link">
          Películas
        </NavLink>
        <NavLink to="/series" className="header__link">
          Series
        </NavLink>
      </nav>

      <div className="header__right" />
    </header>
  )
}

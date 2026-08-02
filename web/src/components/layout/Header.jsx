import './header.css'

import { NavLink } from 'react-router-dom'

// Cabecera flotante con logo y navegación principal.
export default function Header() {
  return (
    <header className="cabecera">
      <div className="cabecera__izquierda">
        <NavLink to="/" className="cabecera__logo" aria-label="Ir al inicio">
          pelsev.io
        </NavLink>
      </div>

      <nav className="cabecera__nav" aria-label="Navegación principal">
        <NavLink to="/peliculas" className="cabecera__enlace">
          Películas
        </NavLink>
        <NavLink to="/series" className="cabecera__enlace">
          Series
        </NavLink>
      </nav>

      <div className="cabecera__derecha" />
    </header>
  )
}

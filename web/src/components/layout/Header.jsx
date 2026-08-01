import './header.css'

import { NavLink } from 'react-router-dom'

import { useSidebar } from '../../context/SidebarContext'

// Cabecera con perfil (abre el sidebar), navegación central y ajustes.
export default function Header() {
  const { alternar } = useSidebar()

  return (
    <header className="cabecera">
      <div className="cabecera__izquierda">
        <button
          type="button"
          className="cabecera__icono"
          onClick={alternar}
          aria-label="Abrir menú de perfil"
        >
          <span className="material-icons" aria-hidden="true">
            account_circle
          </span>
        </button>
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

      <div className="cabecera__derecha">
        <NavLink to="/ajustes" className="cabecera__icono" aria-label="Configuración">
          <span className="material-icons" aria-hidden="true">
            settings
          </span>
        </NavLink>
      </div>
    </header>
  )
}

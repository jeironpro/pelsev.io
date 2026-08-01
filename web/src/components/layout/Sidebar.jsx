import './sidebar.css'

import { NavLink, useLocation } from 'react-router-dom'

import { useSidebar } from '../../context/SidebarContext'

const enlaces = [
  { to: '/', label: 'Inicio', icono: 'home' },
  { to: '/peliculas', label: 'Películas', icono: 'movie' },
  { to: '/series', label: 'Series', icono: 'tv' },
  { to: '/ajustes', label: 'Ajustes', icono: 'settings' },
]

// Panel lateral izquierdo, colapsado por defecto.
export default function Sidebar() {
  const { abierto, cerrar } = useSidebar()
  const location = useLocation()

  // Cierra el panel al cambiar de ruta.
  const alNavegar = () => {
    if (location.pathname) cerrar()
  }

  return (
    <>
      <div
        className={`sidebar-fondo ${abierto ? 'sidebar-fondo--visible' : ''}`}
        onClick={cerrar}
        aria-hidden="true"
      />
      <aside
        className={`sidebar ${abierto ? 'sidebar--abierto' : ''}`}
        aria-label="Perfil"
      >
        <div className="sidebar__perfil">
          <span className="material-icons sidebar__avatar" aria-hidden="true">
            account_circle
          </span>
          <span className="sidebar__nombre">Usuario</span>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              className="sidebar__enlace"
              onClick={alNavegar}
            >
              <span className="material-icons" aria-hidden="true">
                {enlace.icono}
              </span>
              <span>{enlace.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

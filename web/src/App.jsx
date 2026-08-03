import { useState } from 'react'

import { BrowserRouter } from 'react-router-dom'

import CookieConsent from './components/common/CookieConsent'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AppRoutes from './routes'

// Componente raíz de la aplicación.
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((open) => !open)
  const closeMenu = () => setMenuOpen(false)

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header open={menuOpen} onToggleMenu={toggleMenu} />
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <main className="content">
        <AppRoutes />
      </main>
      <CookieConsent />
    </BrowserRouter>
  )
}

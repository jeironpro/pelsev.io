import { BrowserRouter } from 'react-router-dom'

import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import AppRoutes from './routes'
import CookieConsent from './components/common/CookieConsent'

// Componente raíz de la aplicación.
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
      <Sidebar />
      <main className="content">
        <AppRoutes />
      </main>
      <CookieConsent />
    </BrowserRouter>
  )
}

import { BrowserRouter } from 'react-router-dom'

import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import { SidebarProvider } from './context/SidebarContext'
import AppRoutes from './routes'

// Componente raíz de la aplicación.
export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Header />
        <Sidebar />
        <main className="contenido">
          <AppRoutes />
        </main>
      </SidebarProvider>
    </BrowserRouter>
  )
}

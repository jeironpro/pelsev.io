import { createContext, useContext, useState } from 'react'

// Contexto que controla la apertura del panel lateral.
const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [abierto, setAbierto] = useState(false)

  const abrir = () => setAbierto(true)
  const cerrar = () => setAbierto(false)
  const alternar = () => setAbierto((actual) => !actual)

  return (
    <SidebarContext.Provider value={{ abierto, abrir, cerrar, alternar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar debe usarse dentro de SidebarProvider')
  }
  return context
}

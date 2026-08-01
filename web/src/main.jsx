import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './styles/globals.css'
import './styles/components/contenido.css'
import './styles/components/estados.css'

// Punto de entrada de la aplicación web.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

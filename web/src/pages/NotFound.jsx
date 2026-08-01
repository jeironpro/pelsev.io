import { Link } from 'react-router-dom'

// Página 404.
export default function NotFound() {
  return (
    <div className="pagina estado-vacio">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="boton boton--primaria">
        Volver al inicio
      </Link>
    </div>
  )
}

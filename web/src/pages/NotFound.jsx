import { Link } from 'react-router-dom'

// Página 404.
export default function NotFound() {
  return (
    <div className="page empty-state">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="button button--primary">
        Volver al inicio
      </Link>
    </div>
  )
}

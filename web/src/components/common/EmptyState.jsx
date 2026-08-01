// Estado vacío para secciones sin contenido.
export default function EmptyState({ message }) {
  return (
    <div className="estado-vacio">
      <span className="material-icons" aria-hidden="true">
        movie_filter
      </span>
      <p>{message || 'No hay contenido disponible.'}</p>
    </div>
  )
}

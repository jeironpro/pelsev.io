// Estado de error con mensaje y reintento.
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="estado-vacio" role="alert">
      <span className="material-icons" aria-hidden="true">
        error_outline
      </span>
      <p>{message || 'Ha ocurrido un error inesperado.'}</p>
      {onRetry && (
        <button type="button" className="boton boton--secundaria" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

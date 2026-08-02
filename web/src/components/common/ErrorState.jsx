// Estado de error con mensaje y reintento.
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="empty-state" role="alert">
      <span className="material-icons" aria-hidden="true">
        error_outline
      </span>
      <p>{message || 'Ha ocurrido un error inesperado.'}</p>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

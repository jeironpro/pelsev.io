import './spinner.css'

// Indicador de carga.
export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="spinner" role="status" aria-label={label}>
      <span className="spinner__icon material-icons" aria-hidden="true">
        hourglass_empty
      </span>
      <span className="spinner__text">{label}</span>
    </div>
  )
}

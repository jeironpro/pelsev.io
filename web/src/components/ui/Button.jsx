import './button.css'

// Botón con variantes: primaria (acento) y secundaria (superficie).
export default function Button({ children, variant = 'primaria', onClick, ...props }) {
  return (
    <button
      type="button"
      className={`boton boton--${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

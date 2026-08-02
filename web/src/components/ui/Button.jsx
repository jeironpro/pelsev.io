import './button.css'

// Botón con variantes: primaria (acento) y secundaria (superficie).
export default function Button({ children, variant = 'primary', onClick, ...props }) {
  return (
    <button
      type="button"
      className={`button button--${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

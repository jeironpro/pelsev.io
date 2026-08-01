import './horizontalrow.css'

// Fila con scroll horizontal suave y efecto flotante en las tarjetas.
export default function HorizontalRow({ titulo, children }) {
  return (
    <section className="fila" aria-label={titulo}>
      <h2 className="fila__titulo">{titulo}</h2>
      <div className="fila__contenedor">{children}</div>
    </section>
  )
}

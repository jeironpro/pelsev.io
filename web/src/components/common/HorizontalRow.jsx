import { useCallback, useEffect, useRef, useState } from 'react'

import './horizontalrow.css'

// Fila de catálogo con desplazamiento lateral mediante botones.
export default function HorizontalRow({ titulo, children }) {
  const contenedorRef = useRef(null)
  const [puedeAvanzar, setPuedeAvanzar] = useState(false)
  const [puedeRetroceder, setPuedeRetroceder] = useState(false)

  const actualizarBotones = useCallback(() => {
    const el = contenedorRef.current
    if (!el) return
    const tolerancia = 1
    setPuedeRetroceder(el.scrollLeft > tolerancia)
    setPuedeAvanzar(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerancia)
  }, [])

  useEffect(() => {
    const el = contenedorRef.current
    if (!el) return
    actualizarBotones()
    el.addEventListener('scroll', actualizarBotones, { passive: true })
    window.addEventListener('resize', actualizarBotones)
    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(actualizarBotones)
      observer.observe(el)
    }
    return () => {
      el.removeEventListener('scroll', actualizarBotones)
      window.removeEventListener('resize', actualizarBotones)
      observer?.disconnect()
    }
  }, [actualizarBotones])

  const desplazar = (direccion) => {
    const el = contenedorRef.current
    if (!el) return
    el.scrollBy({ left: direccion * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="fila" aria-label={titulo}>
      <div className="fila__cabecera">
        <h2 className="fila__titulo">{titulo}</h2>
        <div className="fila__controles">
          <button
            type="button"
            className="fila__boton"
            aria-label={`Retroceder en ${titulo}`}
            disabled={!puedeRetroceder}
            onClick={() => desplazar(-1)}
          >
            <span className="material-icons" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className="fila__boton"
            aria-label={`Avanzar en ${titulo}`}
            disabled={!puedeAvanzar}
            onClick={() => desplazar(1)}
          >
            <span className="material-icons" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      </div>
      <div className="fila__contenedor" ref={contenedorRef}>
        {children}
      </div>
    </section>
  )
}

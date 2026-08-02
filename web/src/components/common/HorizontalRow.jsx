import { useCallback, useEffect, useRef, useState } from 'react'

import './horizontalrow.css'

// Fila de catálogo con desplazamiento lateral mediante botones.
export default function HorizontalRow({ title, children }) {
  const containerRef = useRef(null)
  const [canForward, setCanForward] = useState(false)
  const [canBackward, setCanBackward] = useState(false)

  const updateButtons = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const tolerance = 1
    setCanBackward(el.scrollLeft > tolerance)
    setCanForward(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateButtons)
      observer.observe(el)
    }
    return () => {
      el.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
      observer?.disconnect()
    }
  }, [updateButtons])

  const scroll = (direction) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="row" aria-label={title}>
      <div className="row__header">
        <h2 className="row__title">{title}</h2>
        <div className="row__controls">
          <button
            type="button"
            className="row__button"
            aria-label={`Retroceder en ${title}`}
            disabled={!canBackward}
            onClick={() => scroll(-1)}
          >
            <span className="material-icons" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className="row__button"
            aria-label={`Avanzar en ${title}`}
            disabled={!canForward}
            onClick={() => scroll(1)}
          >
            <span className="material-icons" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      </div>
      <div className="row__container" ref={containerRef}>
        {children}
      </div>
    </section>
  )
}

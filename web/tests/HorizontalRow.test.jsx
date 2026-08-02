import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import HorizontalRow from '../src/components/common/HorizontalRow'

function renderizar() {
  return render(
    <HorizontalRow titulo="Acción">
      <div>Tarjeta 1</div>
      <div>Tarjeta 2</div>
    </HorizontalRow>
  )
}

describe('HorizontalRow', () => {
  it('muestra el título y el contenido', () => {
    renderizar()
    expect(screen.getByRole('heading', { name: 'Acción' })).toBeInTheDocument()
    expect(screen.getByText('Tarjeta 1')).toBeInTheDocument()
    expect(screen.getByText('Tarjeta 2')).toBeInTheDocument()
  })

  it('desplaza el carrusel con los botones laterales', () => {
    const scrollBy = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value: scrollBy,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 200,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 800,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      get: () => 0,
    })

    renderizar()

    const avanzar = screen.getByRole('button', { name: 'Avanzar en Acción' })
    const retroceder = screen.getByRole('button', {
      name: 'Retroceder en Acción',
    })
    expect(avanzar).toBeEnabled()
    expect(retroceder).toBeDisabled()

    fireEvent.click(avanzar)
    expect(scrollBy).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' })

    delete HTMLElement.prototype.clientWidth
    delete HTMLElement.prototype.scrollWidth
    delete HTMLElement.prototype.scrollLeft
    delete HTMLElement.prototype.scrollBy
  })
})

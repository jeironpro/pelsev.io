import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import ContinueWatchingCard from '../src/components/common/ContinueWatchingCard'

const item = {
  id: 7,
  type: 'movie',
  content_id: 1,
  title: 'El Padrino',
  thumbnail: '/miniatura.jpg',
  duration_sec: 120,
  position_sec: 40,
  remaining_sec: 80,
}

function renderizar(onRemove = vi.fn()) {
  return render(
    <MemoryRouter>
      <ContinueWatchingCard item={item} onRemove={onRemove} />
    </MemoryRouter>
  )
}

describe('ContinueWatchingCard', () => {
  it('muestra título, estado y tiempo restante', () => {
    renderizar()
    expect(screen.getByText('El Padrino')).toBeInTheDocument()
    expect(screen.getByText(/quedan 1m 20s/)).toBeInTheDocument()
  })

  it('elimina el elemento al pulsar el botón de borrado', () => {
    const onRemove = vi.fn()
    renderizar(onRemove)
    fireEvent.click(screen.getByLabelText(/Quitar El Padrino/))
    expect(onRemove).toHaveBeenCalledWith(7)
  })
})

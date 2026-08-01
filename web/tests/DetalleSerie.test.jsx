import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { catalogService } from '../src/services/catalogService'
import DetalleSerie from '../src/pages/DetalleSerie'

vi.mock('../src/services/catalogService', () => ({
  catalogService: { seriesDetail: vi.fn() },
}))

const serie = {
  id: 1,
  title: 'Breaking Bad',
  description: 'Un profesor de química.',
  thumbnail: '/fondo.jpg',
  seasons: [
    {
      id: 10,
      number: 1,
      episodes: [
        { id: 100, number: 1, title: 'Piloto', duration_sec: 3600 },
        { id: 101, number: 2, title: 'El gato', duration_sec: 3600 },
      ],
    },
    {
      id: 11,
      number: 2,
      episodes: [{ id: 200, number: 1, title: 'Otra vez', duration_sec: 3600 }],
    },
  ],
}

function renderizar() {
  return render(
    <MemoryRouter initialEntries={['/serie/1']}>
      <Routes>
        <Route path="/serie/:id" element={<DetalleSerie />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DetalleSerie', () => {
  beforeEach(() => {
    catalogService.seriesDetail.mockResolvedValue(serie)
  })

  it('muestra la serie y los episodios de la primera temporada', async () => {
    renderizar()
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Breaking Bad' })).toBeInTheDocument()
    )
    expect(screen.getByText('Piloto')).toBeInTheDocument()
    expect(screen.getByText('El gato')).toBeInTheDocument()
  })

  it('cambia de temporada al pulsar la temporada 2', async () => {
    const user = userEvent.setup()
    renderizar()
    await waitFor(() => expect(screen.getByText('Piloto')).toBeInTheDocument())
    await user.click(screen.getByText('T2'))
    await waitFor(() => expect(screen.getByText('Otra vez')).toBeInTheDocument())
    expect(screen.queryByText('Piloto')).not.toBeInTheDocument()
  })
})

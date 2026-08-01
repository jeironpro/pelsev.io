import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Home from '../src/pages/Home'
import { catalogService } from '../src/services/catalogService'
import { progressService } from '../src/services/progressService'

vi.mock('../src/services/catalogService', () => ({
  catalogService: { home: vi.fn() },
}))
vi.mock('../src/services/progressService', () => ({
  progressService: {
    continueWatching: vi.fn(),
    remove: vi.fn(),
  },
}))

const homeData = {
  categories: [
    {
      slug: 'accion',
      name: 'Acción',
      movies: [
        {
          id: 1,
          title: 'El Padrino',
          duration_sec: 175,
          thumbnail: '/padrino.jpg',
        },
      ],
      series: [
        {
          id: 5,
          title: 'Breaking Bad',
          thumbnail: '/breaking.jpg',
        },
      ],
    },
  ],
  sagas: [
    {
      id: 2,
      title: 'Star Wars',
      movies: [
        {
          id: 3,
          title: 'Una Nueva Esperanza',
          duration_sec: 121,
          thumbnail: '/sw.jpg',
        },
      ],
    },
  ],
}

function renderizar() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  beforeEach(() => {
    catalogService.home.mockResolvedValue(homeData)
    progressService.continueWatching.mockResolvedValue([])
  })

  it('muestra las filas de sagas y categorías de la API', async () => {
    renderizar()
    await waitFor(() => expect(screen.getByText('Sagas')).toBeInTheDocument())
    expect(screen.getByText('Una Nueva Esperanza')).toBeInTheDocument()
    expect(screen.getByText('Acción')).toBeInTheDocument()
    expect(screen.getByText('El Padrino')).toBeInTheDocument()
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
  })

  it('muestra "Continuar viendo" cuando hay progreso', async () => {
    progressService.continueWatching.mockResolvedValue([
      {
        id: 9,
        type: 'movie',
        content_id: 1,
        title: 'El Padrino',
        thumbnail: '/padrino.jpg',
        position_sec: 40,
        duration_sec: 120,
        remaining_sec: 80,
      },
    ])
    renderizar()
    await waitFor(() => expect(screen.getByText('Continuar viendo')).toBeInTheDocument())
  })

  it('muestra estado vacío si no hay contenido', async () => {
    catalogService.home.mockResolvedValue({ categories: [], sagas: [] })
    renderizar()
    await waitFor(() =>
      expect(screen.getByText('No hay contenido disponible.')).toBeInTheDocument()
    )
  })
})

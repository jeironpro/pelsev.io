import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CategoryCard from '../src/components/common/CategoryCard'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const categoria = {
  slug: 'accion',
  name: 'Acción',
  movies: [{ id: 1 }],
  series: [],
}

function renderizar() {
  return render(
    <MemoryRouter>
      <CategoryCard category={categoria} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  navigateMock.mockClear()
})

describe('CategoryCard', () => {
  it('muestra el nombre y la cantidad de títulos', () => {
    renderizar()
    expect(screen.getByText('Acción')).toBeInTheDocument()
    expect(screen.getByText('1 título')).toBeInTheDocument()
  })

  it('muestra "Próximamente" cuando la categoría está vacía', () => {
    render(
      <MemoryRouter>
        <CategoryCard
          category={{ slug: 'terror', name: 'Terror', movies: [], series: [] }}
        />
      </MemoryRouter>
    )
    expect(screen.getByText('Terror')).toBeInTheDocument()
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
  })

  it('navega a la página de la categoría al pulsar la tarjeta', () => {
    renderizar()
    fireEvent.click(screen.getByRole('link', { name: 'Categoría Acción' }))
    expect(navigateMock).toHaveBeenCalledWith('/categoria/accion')
  })
})

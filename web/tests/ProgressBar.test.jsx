import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ProgressBar from '../src/components/ui/ProgressBar'

describe('ProgressBar', () => {
  it('muestra el porcentaje visto', () => {
    render(<ProgressBar positionSec={60} durationSec={120} />)
    const barra = screen.getByRole('progressbar')
    expect(barra).toHaveAttribute('aria-valuenow', '50')
    expect(barra.firstChild).toHaveStyle({ width: '50%' })
  })

  it('muestra 0% sin duración', () => {
    render(<ProgressBar positionSec={40} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})

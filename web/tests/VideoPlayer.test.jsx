import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import VideoPlayer from '../src/components/player/VideoPlayer'

const play = vi.fn().mockReturnValue(Promise.resolve())
const pause = vi.fn()

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: play,
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: pause,
})

describe('VideoPlayer', () => {
  it('usa controles propios en lugar de los nativos del navegador', () => {
    const { container } = render(<VideoPlayer src="/video.mp4" />)
    const video = container.querySelector('video')
    expect(video).not.toHaveAttribute('controls')
    expect(screen.getByLabelText('Barra de progreso')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Reproducir').length).toBeGreaterThan(0)
  })

  it('alterna a pausa al reproducir', () => {
    const { container } = render(<VideoPlayer src="/video.mp4" />)
    const video = container.querySelector('video')
    fireEvent.play(video)
    expect(screen.getByLabelText('Pausar')).toBeInTheDocument()
  })

  it('notifica el progreso al mover la barra', () => {
    const onTimeUpdate = vi.fn()
    const { container } = render(
      <VideoPlayer src="/video.mp4" onTimeUpdate={onTimeUpdate} />
    )
    const video = container.querySelector('video')
    Object.defineProperty(video, 'duration', { value: 100, configurable: true })
    fireEvent.loadedMetadata(video)
    const barra = screen.getByLabelText('Barra de progreso')
    fireEvent.change(barra, { target: { value: '30' } })
    expect(onTimeUpdate).toHaveBeenCalled()
  })

  it('reproduce o pausa con la barra espaciadora', () => {
    const { container } = render(<VideoPlayer src="/video.mp4" />)
    const jugador = container.firstChild
    fireEvent.keyDown(jugador, { code: 'Space' })
    expect(play).toHaveBeenCalled()
  })
})

import { describe, expect, it } from 'vitest'

import {
  buildSeekUrl,
  formatClock,
  formatDuration,
  percentWatched,
} from '../src/utils/format'

describe('formatDuration', () => {
  it('formatea horas y minutos', () => {
    expect(formatDuration(4800)).toBe('1h 20m')
  })

  it('formatea minutos y segundos', () => {
    expect(formatDuration(190)).toBe('3m 10s')
  })

  it('formatea solo segundos', () => {
    expect(formatDuration(42)).toBe('42s')
  })

  it('gestiona valores inválidos', () => {
    expect(formatDuration(null)).toBe('0s')
  })
})

describe('formatClock', () => {
  it('usa formato mm:ss', () => {
    expect(formatClock(65)).toBe('1:05')
  })

  it('usa formato h:mm:ss con horas', () => {
    expect(formatClock(3723)).toBe('1:02:03')
  })

  it('redondea segundos con decimales', () => {
    expect(formatClock(0.432)).toBe('0:00')
    expect(formatClock(1402.154)).toBe('23:22')
  })
})

describe('percentWatched', () => {
  it('calcula el porcentaje', () => {
    expect(percentWatched(60, 120)).toBe(50)
  })

  it('limita al 100%', () => {
    expect(percentWatched(200, 120)).toBe(100)
  })

  it('evita la división por cero', () => {
    expect(percentWatched(10, 0)).toBe(0)
  })
})

describe('buildSeekUrl', () => {
  it('añade el parámetro t cuando hay posición', () => {
    expect(buildSeekUrl('/video', 30)).toBe('/video?t=30')
  })

  it('mantiene la URL sin posición', () => {
    expect(buildSeekUrl('/video', 0)).toBe('/video')
  })
})

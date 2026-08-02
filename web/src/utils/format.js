// Utilidades de formato de pelsev.io.

// Convierte segundos a un formato legible, p. ej. "1h 20m" o "3m 10s".
export function formatDuration(totalSeconds) {
  const seconds = Math.round(Number(totalSeconds) || 0)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = seconds % 60

  if (hours > 0) {
    const mins = minutes ? `${minutes}m` : ''
    return `${hours}h ${mins}`.trim()
  }
  if (minutes > 0) {
    return `${minutes}m ${rest}s`
  }
  return `${rest}s`
}

// Convierte segundos al formato de reloj "mm:ss" para el reproductor.
export function formatClock(totalSeconds) {
  const seconds = Math.round(Math.max(0, Number(totalSeconds) || 0))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = String(seconds % 60).padStart(2, '0')
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${rest}`
  }
  return `${minutes}:${rest}`
}

// Calcula el porcentaje visto a partir de posición y duración.
export function percentWatched(positionSec, durationSec) {
  if (!durationSec) return 0
  return Math.min(100, Math.max(0, (positionSec / durationSec) * 100))
}

// Navega al punto exacto de un vídeo saltando por la URL.
export function buildSeekUrl(videoUrl, positionSec) {
  if (!positionSec) return videoUrl
  const separator = videoUrl.includes('?') ? '&' : '?'
  return `${videoUrl}${separator}t=${positionSec}`
}

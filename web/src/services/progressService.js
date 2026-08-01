import api from './api'

// Servicios de reproducción y "Continuar viendo".
export const progressService = {
  // Elementos en curso con su estado de visualización.
  continueWatching() {
    return api.get('/api/playback/progress/continue-watching/').then((r) => r.data)
  },

  // Guarda o actualiza la posición de una película o episodio.
  save({ type, contentId, positionSec, durationSec, completed }) {
    return api
      .post('/api/playback/progress/', {
        type,
        content_id: contentId,
        position_sec: Math.round(positionSec),
        duration_sec: Math.round(durationSec),
        completed: Boolean(completed),
      })
      .then((r) => r.data)
  },

  // Elimina un elemento de "Continuar viendo".
  remove(id) {
    return api.delete(`/api/playback/progress/${id}/`)
  },
}

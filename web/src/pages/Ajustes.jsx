import { useCallback, useState } from 'react'

import ErrorState from '../components/common/ErrorState'
import Button from '../components/ui/Button'
import { progressService } from '../services/progressService'

import './ajustes.css'

// Página de ajustes: limpieza del historial de reproducción.
export default function Ajustes() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)

  const clearHistory = useCallback(async () => {
    setLoading(true)
    setMessage('')
    setError(null)
    try {
      const lista = await progressService.continueWatching()
      await Promise.all(lista.map((item) => progressService.remove(item.id)))
      setMessage('Historial de reproducción limpiado.')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="page">
      <h1 className="page__title">Ajustes</h1>

      <section className="settings__section">
        <h2>Historial de reproducción</h2>
        <p>
          Elimina todo el historial de &quot;Continuar viendo&quot;. Esta acción no se
          puede deshacer.
        </p>
        <Button variant="secondary" onClick={clearHistory} disabled={loading}>
          <span className="material-icons" aria-hidden="true">
            delete_sweep
          </span>
          Limpiar historial
        </Button>
        {message && <p className="settings__message">{message}</p>}
        {error && <ErrorState message={error.message} />}
      </section>
    </div>
  )
}

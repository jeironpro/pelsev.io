import { useCallback, useState } from 'react'

import ErrorState from '../components/common/ErrorState'
import Button from '../components/ui/Button'
import { progressService } from '../services/progressService'

import './ajustes.css'

// Página de ajustes: limpieza del historial de reproducción.
export default function Ajustes() {
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(null)

  const limpiarHistorial = useCallback(async () => {
    setCargando(true)
    setMensaje('')
    setError(null)
    try {
      const lista = await progressService.continueWatching()
      await Promise.all(lista.map((item) => progressService.remove(item.id)))
      setMensaje('Historial de reproducción limpiado.')
    } catch (err) {
      setError(err)
    } finally {
      setCargando(false)
    }
  }, [])

  return (
    <div className="pagina">
      <h1 className="pagina__titulo">Ajustes</h1>

      <section className="ajustes__seccion">
        <h2>Historial de reproducción</h2>
        <p>
          Elimina todo el historial de &quot;Continuar viendo&quot;. Esta acción no se
          puede deshacer.
        </p>
        <Button variant="secundaria" onClick={limpiarHistorial} disabled={cargando}>
          <span className="material-icons" aria-hidden="true">
            delete_sweep
          </span>
          Limpiar historial
        </Button>
        {mensaje && <p className="ajustes__mensaje">{mensaje}</p>}
        {error && <ErrorState message={error.message} />}
      </section>
    </div>
  )
}

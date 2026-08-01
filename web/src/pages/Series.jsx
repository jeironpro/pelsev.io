import { useCallback, useEffect, useState } from 'react'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Página de series.
export default function Series() {
  const [series, setSeries] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      setSeries(await catalogService.series())
    } catch (err) {
      setError(err)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (error) {
    return (
      <div className="pagina">
        <ErrorState message={error.message} onRetry={cargar} />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="pagina">
      <h1 className="pagina__titulo">Series</h1>
      {series.length === 0 ? (
        <EmptyState message="No hay series disponibles." />
      ) : (
        <div className="grid-catalogo">
          {series.map((serie) => (
            <ContentCard key={serie.id} item={serie} tipo="serie" />
          ))}
        </div>
      )}
    </div>
  )
}

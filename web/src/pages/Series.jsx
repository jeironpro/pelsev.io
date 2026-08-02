import { useCallback, useEffect, useState } from 'react'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Página de series.
export default function Series() {
  const [shows, setShows] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setShows(await catalogService.series())
    } catch (err) {
      setError(err)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={load} />
      </div>
    )
  }

  if (!shows) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title">Series</h1>
      {shows.length === 0 ? (
        <EmptyState message="No hay series disponibles." />
      ) : (
        <div className="catalog-grid">
          {shows.map((show) => (
            <ContentCard key={show.id} item={show} type="serie" />
          ))}
        </div>
      )}
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Página de películas.
export default function Peliculas() {
  const [movies, setMovies] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setMovies(await catalogService.movies())
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

  if (!movies) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title">Películas</h1>
      {movies.length === 0 ? (
        <EmptyState message="No hay películas disponibles." />
      ) : (
        <div className="catalog-grid">
          {movies.map((movie) => (
            <ContentCard key={movie.id} item={movie} type="pelicula" />
          ))}
        </div>
      )}
    </div>
  )
}

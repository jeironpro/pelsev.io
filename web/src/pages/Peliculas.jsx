import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useMovies } from '../hooks/useCatalog'

// Página de películas.
export default function Peliculas() {
  const { data: movies, loading, error, reload } = useMovies()

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={reload} />
      </div>
    )
  }

  if (loading || !movies) {
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

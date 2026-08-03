import './categoria.css'

import { useParams } from 'react-router-dom'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useCategory } from '../hooks/useCatalog'

// Página de una categoría: películas y series asociadas.
export default function Categoria() {
  const { slug } = useParams()
  const { data: category, loading, error, reload } = useCategory(slug)

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={reload} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="page">
        <EmptyState message="No se encontró esta categoría." />
      </div>
    )
  }

  const movies = category.movies
  const series = category.series

  return (
    <div className="page">
      <h1 className="page__title">{category.name}</h1>

      <section className="category__section">
        <h2 className="page__title category__subtitle">Películas</h2>
        {movies.length === 0 ? (
          <EmptyState message="No hay películas en esta categoría." />
        ) : (
          <div className="catalog-grid">
            {movies.map((movie) => (
              <ContentCard key={movie.id} item={movie} type="pelicula" />
            ))}
          </div>
        )}
      </section>

      <section className="category__section">
        <h2 className="page__title category__subtitle">Series</h2>
        {series.length === 0 ? (
          <EmptyState message="No hay series en esta categoría." />
        ) : (
          <div className="catalog-grid">
            {series.map((serie) => (
              <ContentCard key={serie.id} item={serie} type="serie" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

import './categoria.css'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Página de una categoría: películas y series asociadas.
export default function Categoria() {
  const { slug } = useParams()
  const [categories, setCategories] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await catalogService.home()
      setCategories(data.categories)
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

  if (!categories) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    return (
      <div className="page">
        <EmptyState message="No se encontró esta categoría." />
      </div>
    )
  }

  const movies = category.movies
  const shows = category.series

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
        {shows.length === 0 ? (
          <EmptyState message="No hay series en esta categoría." />
        ) : (
          <div className="catalog-grid">
            {shows.map((show) => (
              <ContentCard key={show.id} item={show} type="serie" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

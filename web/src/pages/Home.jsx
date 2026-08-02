import './paginas.css'

import { useCallback, useEffect, useState } from 'react'

import CategoryCard from '../components/common/CategoryCard'
import ContinueWatchingCard from '../components/common/ContinueWatchingCard'
import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import HorizontalRow from '../components/common/HorizontalRow'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'
import { progressService } from '../services/progressService'

// Página de inicio: categorías, "Continuar viendo" y secciones por categoría.
export default function Home() {
  const [catalog, setCatalog] = useState(null)
  const [continueWatching, setContinueWatching] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [homeData, continueWatchingData] = await Promise.all([
        catalogService.home(),
        progressService.continueWatching(),
      ])
      setCatalog(homeData)
      setContinueWatching(continueWatchingData)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Elimina un elemento de "Continuar viendo".
  const remove = async (id) => {
    try {
      await progressService.remove(id)
      setContinueWatching((current) => current.filter((item) => item.id !== id))
    } catch {
      // Se mantiene la lista original si falla la petición.
    }
  }

  if (loading && !catalog) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  if (error && !catalog) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={load} />
      </div>
    )
  }

  const categories = catalog?.categories ?? []

  return (
    <div className="page">
      {categories.length > 0 && (
        <HorizontalRow title="Categorías">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </HorizontalRow>
      )}

      {continueWatching.length > 0 && (
        <HorizontalRow title="Continuar viendo">
          {continueWatching.map((item) => (
            <ContinueWatchingCard key={item.id} item={item} onRemove={remove} />
          ))}
        </HorizontalRow>
      )}

      {catalog?.sagas?.length > 0 && (
        <HorizontalRow title="Sagas">
          {catalog.sagas.map((saga) => (
            <ContentCard key={saga.id} item={saga.movies[0] || {}} type="pelicula" />
          ))}
        </HorizontalRow>
      )}

      {categories.length === 0 && <EmptyState message="No hay contenido disponible." />}

      {categories.map((category) => {
        const items = [
          ...category.movies.map((m) => ({ ...m, type: 'pelicula' })),
          ...category.series.map((s) => ({ ...s, type: 'series' })),
        ]
        return (
          <HorizontalRow key={category.slug} title={category.name}>
            {items.length === 0 ? (
              <EmptyState message="Aún no hay títulos en esta categoría." />
            ) : (
              items.map((item) => (
                <ContentCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  type={item.type === 'pelicula' ? 'pelicula' : 'serie'}
                />
              ))
            )}
          </HorizontalRow>
        )
      })}
    </div>
  )
}

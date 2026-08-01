import './paginas.css'

import { useCallback, useEffect, useState } from 'react'

import ContinueWatchingCard from '../components/common/ContinueWatchingCard'
import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import HorizontalRow from '../components/common/HorizontalRow'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'
import { progressService } from '../services/progressService'

// Página de inicio: "Continuar viendo" y filas por categoría.
export default function Home() {
  const [catalogo, setCatalogo] = useState(null)
  const [continuar, setContinuar] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const [homeData, continuarData] = await Promise.all([
        catalogService.home(),
        progressService.continueWatching(),
      ])
      setCatalogo(homeData)
      setContinuar(continuarData)
    } catch (err) {
      setError(err)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  // Elimina un elemento de "Continuar viendo".
  const quitar = async (id) => {
    try {
      await progressService.remove(id)
      setContinuar((actual) => actual.filter((item) => item.id !== id))
    } catch {
      // Se mantiene la lista original si falla la petición.
    }
  }

  if (cargando && !catalogo) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  if (error && !catalogo) {
    return (
      <div className="pagina">
        <ErrorState message={error.message} onRetry={cargar} />
      </div>
    )
  }

  return (
    <div className="pagina">
      {continuar.length > 0 && (
        <HorizontalRow titulo="Continuar viendo">
          {continuar.map((item) => (
            <ContinueWatchingCard key={item.id} item={item} onRemove={quitar} />
          ))}
        </HorizontalRow>
      )}

      {catalogo?.sagas?.length > 0 && (
        <HorizontalRow titulo="Sagas">
          {catalogo.sagas.map((saga) => (
            <ContentCard key={saga.id} item={saga.movies[0] || {}} tipo="pelicula" />
          ))}
        </HorizontalRow>
      )}

      {catalogo?.categories?.length === 0 && (
        <EmptyState message="No hay contenido disponible." />
      )}

      {catalogo?.categories?.map((categoria) => {
        const items = [
          ...categoria.movies.map((p) => ({ ...p, tipo: 'pelicula' })),
          ...categoria.series.map((s) => ({ ...s, tipo: 'series' })),
        ]
        if (items.length === 0) return null
        return (
          <HorizontalRow key={categoria.slug} titulo={categoria.name}>
            {items.map((item) => (
              <ContentCard
                key={`${item.tipo}-${item.id}`}
                item={item}
                tipo={item.tipo === 'pelicula' ? 'pelicula' : 'serie'}
              />
            ))}
          </HorizontalRow>
        )
      })}
    </div>
  )
}

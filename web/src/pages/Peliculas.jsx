import { useCallback, useEffect, useState } from 'react'

import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Página de películas.
export default function Peliculas() {
  const [peliculas, setPeliculas] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      setPeliculas(await catalogService.movies())
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

  if (!peliculas) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="pagina">
      <h1 className="pagina__titulo">Películas</h1>
      {peliculas.length === 0 ? (
        <EmptyState message="No hay películas disponibles." />
      ) : (
        <div className="grid-catalogo">
          {peliculas.map((pelicula) => (
            <ContentCard key={pelicula.id} item={pelicula} tipo="pelicula" />
          ))}
        </div>
      )}
    </div>
  )
}

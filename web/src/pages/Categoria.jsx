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
  const [categorias, setCategorias] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      const data = await catalogService.home()
      setCategorias(data.categories)
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

  if (!categorias) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  const categoria = categorias.find((c) => c.slug === slug)

  if (!categoria) {
    return (
      <div className="pagina">
        <EmptyState message="No se encontró esta categoría." />
      </div>
    )
  }

  const peliculas = categoria.movies
  const series = categoria.series

  return (
    <div className="pagina">
      <h1 className="pagina__titulo">{categoria.name}</h1>

      <section className="categoria__seccion">
        <h2 className="pagina__titulo categoria__sub">Películas</h2>
        {peliculas.length === 0 ? (
          <EmptyState message="No hay películas en esta categoría." />
        ) : (
          <div className="grid-catalogo">
            {peliculas.map((pelicula) => (
              <ContentCard key={pelicula.id} item={pelicula} tipo="pelicula" />
            ))}
          </div>
        )}
      </section>

      <section className="categoria__seccion">
        <h2 className="pagina__titulo categoria__sub">Series</h2>
        {series.length === 0 ? (
          <EmptyState message="No hay series en esta categoría." />
        ) : (
          <div className="grid-catalogo">
            {series.map((serie) => (
              <ContentCard key={serie.id} item={serie} tipo="serie" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

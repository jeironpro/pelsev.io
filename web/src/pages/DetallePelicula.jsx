import './detalle.css'

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'
import { formatDuration } from '../utils/format'

// Detalle de película: fondo con opacidad, play centrado, título y duración.
export default function DetallePelicula() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pelicula, setPelicula] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      setPelicula(await catalogService.movie(id))
    } catch (err) {
      setError(err)
    }
  }, [id])

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

  if (!pelicula) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="detalle">
      <img
        className="detalle__fondo"
        src={pelicula.thumbnail}
        alt=""
        aria-hidden="true"
      />
      <div className="detalle__cuerpo">
        <h1 className="detalle__titulo">{pelicula.title}</h1>

        <button
          type="button"
          className="detalle__reproducir"
          onClick={() =>
            navigate(`/reproductor/pelicula/${pelicula.id}`, {
              state: { titulo: pelicula.title },
            })
          }
          aria-label={`Reproducir ${pelicula.title}`}
        >
          <span className="material-icons" aria-hidden="true">
            play_circle
          </span>
          <span className="detalle__duracion">
            {formatDuration(pelicula.duration_sec)}
          </span>
        </button>

        {pelicula.description && (
          <p className="detalle__descripcion">{pelicula.description}</p>
        )}
      </div>
    </div>
  )
}

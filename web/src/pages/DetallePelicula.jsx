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
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setMovie(await catalogService.movie(id))
    } catch (err) {
      setError(err)
    }
  }, [id])

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

  if (!movie) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="detail">
      <img
        className="detail__background"
        src={movie.thumbnail}
        alt=""
        aria-hidden="true"
      />
      <div className="detail__body">
        <h1 className="detail__title">{movie.title}</h1>

        <button
          type="button"
          className="detail__play"
          onClick={() =>
            navigate(`/reproductor/pelicula/${movie.id}`, {
              state: { title: movie.title },
            })
          }
          aria-label={`Reproducir ${movie.title}`}
        >
          <span className="material-icons" aria-hidden="true">
            play_circle
          </span>
          <span className="detail__duration">{formatDuration(movie.duration_sec)}</span>
        </button>

        {movie.description && (
          <p className="detail__description">{movie.description}</p>
        )}
      </div>
    </div>
  )
}

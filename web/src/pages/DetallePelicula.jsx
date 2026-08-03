import './detalle.css'

import { useNavigate, useParams } from 'react-router-dom'

import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useMovie } from '../hooks/useCatalog'
import { formatDuration } from '../utils/format'

// Detalle de película: fondo con opacidad, play centrado, título y duración.
export default function DetallePelicula() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: movie, loading, error, reload } = useMovie(id)

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={reload} />
      </div>
    )
  }

  if (loading || !movie) {
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

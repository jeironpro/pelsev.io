import './continuarviendo.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de "Continuar viendo": estado, tiempo restante y borrado.
export default function ContinueWatchingCard({ item, onRemove }) {
  const navigate = useNavigate()
  const type = item.type === 'movie' ? 'pelicula' : 'episodio'

  const destiny =
    type === 'pelicula'
      ? `/pelicula/${item.content_id}`
      : `/reproductor/episodio/${item.content_id}`

  const open = () =>
    navigate(destiny, {
      state: { title: item.title, type: item.type },
    })

  return (
    <article
      className="continue-watching"
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter') open()
      }}
      aria-label={item.title}
    >
      <img
        className="continue-watching__image"
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
      />
      <div className="continue-watching__content">
        <h3 className="continue-watching__title">{item.title}</h3>
        <span className="continue-watching__status">
          {formatDuration(item.position_sec)} vistos · quedan{' '}
          {formatDuration(item.remaining_sec)}
        </span>
        <ProgressBar positionSec={item.position_sec} durationSec={item.duration_sec} />
      </div>
      <button
        type="button"
        className="continue-watching__remove"
        onClick={(event) => {
          event.stopPropagation()
          onRemove(item.id)
        }}
        aria-label={`Quitar ${item.title} de continuar viendo`}
      >
        <span className="material-icons" aria-hidden="true">
          delete
        </span>
      </button>
    </article>
  )
}

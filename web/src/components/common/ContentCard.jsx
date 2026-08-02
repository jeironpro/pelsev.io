import './contentcard.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de película o serie para las filas del catálogo.
export default function ContentCard({ item, type }) {
  const navigate = useNavigate()
  const destiny = `/${type}/${item.id}`

  return (
    <article
      className="card"
      onClick={() => navigate(destiny)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destiny)
      }}
      aria-label={item.title}
    >
      <img
        className="card__image"
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
      />
      <div className="card__content">
        <h3 className="card__title">{item.title}</h3>
        <span className="card__duration">{formatDuration(item.duration_sec)}</span>
      </div>
      {item.progress?.position_sec > 0 && (
        <div className="card__progress">
          <ProgressBar
            positionSec={item.progress.position_sec}
            durationSec={item.progress.duration_sec}
          />
        </div>
      )}
    </article>
  )
}

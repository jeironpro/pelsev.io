import './episodecard.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de episodio con título, duración y estado de visualización.
export default function EpisodeCard({ episode, serieId, seasonNumber }) {
  const navigate = useNavigate()
  const destiny = `/reproductor/episodio/${episode.id}`
  const navigation = { state: { title: episode.title, serieId, seasonNumber } }

  const status =
    episode.progress && episode.progress.position_sec > 0
      ? `${formatDuration(episode.progress.position_sec)} vistos`
      : 'Sin empezar'

  return (
    <article
      className="episode"
      role="link"
      tabIndex={0}
      onClick={() => navigate(destiny, navigation)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destiny, navigation)
      }}
      aria-label={`Episodio ${episode.number}: ${episode.title}`}
    >
      <div className="episode__header">
        <span className="episode__number">{episode.number}</span>
        <h3 className="episode__title">{episode.title}</h3>
        <span className="episode__duration">
          {formatDuration(episode.duration_sec)}
        </span>
      </div>
      <div className="episode__status">{status}</div>
      <ProgressBar
        positionSec={episode.progress?.position_sec || 0}
        durationSec={episode.duration_sec}
      />
    </article>
  )
}

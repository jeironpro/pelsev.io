import './episodecard.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de episodio con título, duración y estado de visualización.
export default function EpisodeCard({ episode, serieId, seasonNumber }) {
  const navigate = useNavigate()
  const destino = `/reproductor/episodio/${episode.id}`
  const navegacion = { state: { titulo: episode.title, serieId, seasonNumber } }

  const estado =
    episode.progress && episode.progress.position_sec > 0
      ? `${formatDuration(episode.progress.position_sec)} vistos`
      : 'Sin empezar'

  return (
    <article
      className="episodio"
      role="link"
      tabIndex={0}
      onClick={() => navigate(destino, navegacion)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destino, navegacion)
      }}
      aria-label={`Episodio ${episode.number}: ${episode.title}`}
    >
      <div className="episodio__encabezado">
        <span className="episodio__numero">{episode.number}</span>
        <h3 className="episodio__titulo">{episode.title}</h3>
        <span className="episodio__duracion">
          {formatDuration(episode.duration_sec)}
        </span>
      </div>
      <div className="episodio__estado">{estado}</div>
      <ProgressBar
        positionSec={episode.progress?.position_sec || 0}
        durationSec={episode.duration_sec}
      />
    </article>
  )
}

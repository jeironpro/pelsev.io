import './continuarviendo.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de "Continuar viendo": estado, tiempo restante y borrado.
export default function ContinueWatchingCard({ item, onRemove }) {
  const navigate = useNavigate()
  const tipo = item.type === 'movie' ? 'pelicula' : 'episodio'

  const destino =
    tipo === 'pelicula'
      ? `/pelicula/${item.content_id}`
      : `/reproductor/episodio/${item.content_id}`

  const abrir = () =>
    navigate(destino, {
      state: { titulo: item.title, tipo: item.type },
    })

  return (
    <article
      className="continuar"
      role="link"
      tabIndex={0}
      onClick={abrir}
      onKeyDown={(event) => {
        if (event.key === 'Enter') abrir()
      }}
      aria-label={item.title}
    >
      <img
        className="continuar__imagen"
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
      />
      <div className="continuar__contenido">
        <h3 className="continuar__titulo">{item.title}</h3>
        <span className="continuar__estado">
          {formatDuration(item.position_sec)} vistos · quedan{' '}
          {formatDuration(item.remaining_sec)}
        </span>
        <ProgressBar positionSec={item.position_sec} durationSec={item.duration_sec} />
      </div>
      <button
        type="button"
        className="continuar__borrar"
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

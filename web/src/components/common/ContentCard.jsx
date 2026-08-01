import './contentcard.css'

import { useNavigate } from 'react-router-dom'

import { formatDuration } from '../../utils/format'
import ProgressBar from '../ui/ProgressBar'

// Tarjeta de película o serie para las filas del catálogo.
export default function ContentCard({ item, tipo }) {
  const navigate = useNavigate()
  const destino = `/${tipo}/${item.id}`

  return (
    <article
      className="tarjeta"
      onClick={() => navigate(destino)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destino)
      }}
      aria-label={item.title}
    >
      <img
        className="tarjeta__imagen"
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
      />
      <div className="tarjeta__contenido">
        <h3 className="tarjeta__titulo">{item.title}</h3>
        <span className="tarjeta__duracion">{formatDuration(item.duration_sec)}</span>
      </div>
      {item.progress?.position_sec > 0 && (
        <div className="tarjeta__progreso">
          <ProgressBar
            positionSec={item.progress.position_sec}
            durationSec={item.progress.duration_sec}
          />
        </div>
      )}
    </article>
  )
}

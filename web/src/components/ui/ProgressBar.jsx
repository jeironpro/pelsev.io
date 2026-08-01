import './progressbar.css'

import { percentWatched } from '../../utils/format'

// Barra de progreso de visualización.
export default function ProgressBar({ positionSec = 0, durationSec = 0 }) {
  const porcentaje = percentWatched(positionSec, durationSec)
  return (
    <div
      className="progressbar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(porcentaje)}
    >
      <div className="progressbar__relleno" style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

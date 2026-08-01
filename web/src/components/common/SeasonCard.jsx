import './seasons.css'

// Tarjeta rectangular de temporada; la activa se resalta.
export default function SeasonCard({ season, activa, onSelect }) {
  return (
    <button
      type="button"
      className={`temporada ${activa ? 'temporada--activa' : ''}`}
      onClick={onSelect}
      aria-pressed={activa}
    >
      <span className="temporada__numero">T{season.number}</span>
      <span className="temporada__episodios">
        {season.episodes?.length || 0} episodios
      </span>
    </button>
  )
}

import './seasons.css'

// Tarjeta rectangular de temporada; la activa se resalta.
export default function SeasonCard({ season, active, onSelect }) {
  return (
    <button
      type="button"
      className={`season ${active ? 'season--active' : ''}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <span className="season__number">T{season.number}</span>
      <span className="season__episodes">
        {season.episodes?.length || 0} episodios
      </span>
    </button>
  )
}

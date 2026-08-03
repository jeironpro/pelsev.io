import './detalle.css'
import './serie.css'

import { useParams, useSearchParams } from 'react-router-dom'

import EpisodeCard from '../components/common/EpisodeCard'
import ErrorState from '../components/common/ErrorState'
import SeasonCard from '../components/common/SeasonCard'
import Spinner from '../components/ui/Spinner'
import { useSerieDetail } from '../hooks/useCatalog'

// Detalle de serie: fondo con opacidad, temporadas y episodios con estado.
export default function DetalleSerie() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const seasonParam = searchParams.get('temporada')

  const { data: series, loading, error, reload } = useSerieDetail(id)
  const activeSeason = series
    ? series.seasons.find((s) => String(s.number) === seasonParam)?.id ??
      series.seasons?.[0]?.id ??
      null
    : null

  // Selecciona una temporada y la refleja en la URL para recuperarla al volver.
  const selectSeason = (season) => {
    setSearchParams({ temporada: String(season.number) }, { replace: true })
  }

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={reload} />
      </div>
    )
  }

  if (loading || !series) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  const season = series.seasons.find((s) => s.id === activeSeason) || series.seasons[0]

  return (
    <div className="detail">
      <img
        className="detail__background"
        src={series.thumbnail}
        alt=""
        aria-hidden="true"
      />
      <div className="detail__body">
        <h1 className="detail__title">{series.title}</h1>
        {series.description && (
          <p className="detail__description">{series.description}</p>
        )}

        <div className="series-detail__seasons">
          {series.seasons.map((s) => (
            <SeasonCard
              key={s.id}
              season={s}
              active={s.id === season?.id}
              onSelect={() => selectSeason(s)}
            />
          ))}
        </div>

        {season && (
          <div className="series-detail__episodes">
            {season.episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                serieId={series.id}
                seasonNumber={season.number}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

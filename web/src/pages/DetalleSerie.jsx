import './detalle.css'
import './serie.css'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import EpisodeCard from '../components/common/EpisodeCard'
import ErrorState from '../components/common/ErrorState'
import SeasonCard from '../components/common/SeasonCard'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Detalle de serie: fondo con opacidad, temporadas y episodios con estado.
export default function DetalleSerie() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const seasonParam = searchParams.get('temporada')

  const [series, setSeries] = useState(null)
  const [activeSeason, setActiveSeason] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await catalogService.seriesDetail(id)
      setSeries(data)
      const highlighted = data.seasons.find((s) => String(s.number) === seasonParam)
      setActiveSeason(highlighted?.id ?? data.seasons?.[0]?.id ?? null)
    } catch (err) {
      setError(err)
    }
  }, [id, seasonParam])

  useEffect(() => {
    load()
  }, [load])

  // Selecciona una temporada y la refleja en la URL para recuperarla al volver.
  const selectSeason = (season) => {
    setActiveSeason(season.id)
    setSearchParams({ temporada: String(season.number) }, { replace: true })
  }

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={load} />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  const season =
    series.seasons.find((s) => s.id === activeSeason) || series.seasons[0]

  return (
    <div className="detail">
      <img className="detail__background" src={series.thumbnail} alt="" aria-hidden="true" />
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

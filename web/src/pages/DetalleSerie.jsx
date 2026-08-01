import './detalle.css'
import './serie.css'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import EpisodeCard from '../components/common/EpisodeCard'
import ErrorState from '../components/common/ErrorState'
import SeasonCard from '../components/common/SeasonCard'
import Spinner from '../components/ui/Spinner'
import { catalogService } from '../services/catalogService'

// Detalle de serie: fondo con opacidad, temporadas y episodios con estado.
export default function DetalleSerie() {
  const { id } = useParams()
  const [serie, setSerie] = useState(null)
  const [temporadaActiva, setTemporadaActiva] = useState(null)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setError(null)
    try {
      const data = await catalogService.seriesDetail(id)
      setSerie(data)
      setTemporadaActiva(data.seasons?.[0]?.id ?? null)
    } catch (err) {
      setError(err)
    }
  }, [id])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (error) {
    return (
      <div className="pagina">
        <ErrorState message={error.message} onRetry={cargar} />
      </div>
    )
  }

  if (!serie) {
    return (
      <div className="cargando">
        <Spinner />
      </div>
    )
  }

  const temporada =
    serie.seasons.find((t) => t.id === temporadaActiva) || serie.seasons[0]

  return (
    <div className="detalle">
      <img className="detalle__fondo" src={serie.thumbnail} alt="" aria-hidden="true" />
      <div className="detalle__cuerpo">
        <h1 className="detalle__titulo">{serie.title}</h1>
        {serie.description && (
          <p className="detalle__descripcion">{serie.description}</p>
        )}

        <div className="serie-detalle__temporadas">
          {serie.seasons.map((t) => (
            <SeasonCard
              key={t.id}
              season={t}
              activa={t.id === temporada?.id}
              onSelect={() => setTemporadaActiva(t.id)}
            />
          ))}
        </div>

        {temporada && (
          <div className="serie-detalle__episodios">
            {temporada.episodes.map((episodio) => (
              <EpisodeCard
                key={episodio.id}
                episode={episodio}
                serieId={serie.id}
                seasonNumber={temporada.number}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

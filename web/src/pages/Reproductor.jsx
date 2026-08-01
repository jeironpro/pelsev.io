import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import ErrorState from '../components/common/ErrorState'
import { progressService } from '../services/progressService'
import { formatClock } from '../utils/format'

import './reproductor.css'

// Conversión de tipo de ruta a tipo de la API.
const TIPOS_API = {
  pelicula: 'movie',
  episodio: 'episode',
}

// Guarda el progreso como mucho cada 5 segundos.
const INTERVALO_GUARDADO = 5

// Página de reproducción: guarda y reanuda el estado de visualización.
export default function Reproductor() {
  const { tipo, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const videoRef = useRef(null)
  const ultimoGuardado = useRef(0)
  const posicionReanudar = useRef(0)
  const tipoApi = TIPOS_API[tipo]

  const [error, setError] = useState(null)
  const [progreso, setProgreso] = useState({ posicion: 0, duracion: 0 })
  const titulo = location.state?.titulo

  // Recupera la última posición guardada para reanudar.
  useEffect(() => {
    let activo = true
    async function recuperar() {
      try {
        const lista = await progressService.continueWatching()
        const item = lista.find(
          (x) => x.type === tipoApi && x.content_id === Number(id)
        )
        if (activo && item) {
          posicionReanudar.current = item.position_sec
        }
      } catch {
        // Si falla la recuperación, se empieza desde el principio.
      }
    }
    if (tipoApi) {
      recuperar()
    }
    return () => {
      activo = false
    }
  }, [tipoApi, id])

  // Guarda el progreso actual en la API.
  const guardar = useCallback(
    (completado = false) => {
      const video = videoRef.current
      if (!video || !video.duration) return
      const finalizado = completado || video.currentTime >= video.duration - 5
      progressService.save({
        type: tipoApi,
        contentId: Number(id),
        positionSec: video.currentTime,
        durationSec: video.duration,
        completed: finalizado,
      })
    },
    [tipoApi, id]
  )

  // Guarda al salir de la página.
  useEffect(() => {
    const alSalir = () => guardar()
    const alOcultar = () => guardar()
    window.addEventListener('beforeunload', alSalir)
    document.addEventListener('visibilitychange', alOcultar)
    return () => {
      guardar()
      window.removeEventListener('beforeunload', alSalir)
      document.removeEventListener('visibilitychange', alOcultar)
    }
  }, [guardar])

  // Acciones del reproductor.
  const alMetadatos = () => {
    const video = videoRef.current
    if (!video) return
    if (posicionReanudar.current > 0 && posicionReanudar.current < video.duration - 5) {
      video.currentTime = posicionReanudar.current
    }
    setProgreso((actual) => ({ ...actual, duracion: video.duration }))
  }

  const alTiempo = () => {
    const video = videoRef.current
    if (!video) return
    setProgreso({ posicion: video.currentTime, duracion: video.duration })
    const ahora = video.currentTime
    if (ahora - ultimoGuardado.current >= INTERVALO_GUARDADO) {
      ultimoGuardado.current = ahora
      guardar()
    }
  }

  const alTerminar = () => guardar(true)

  if (!tipoApi) {
    return (
      <div className="pagina">
        <ErrorState message="Tipo de contenido no válido." />
      </div>
    )
  }

  return (
    <div className="reproductor">
      <div className="reproductor__barra">
        <Button variant="secundaria" onClick={() => navigate(-1)}>
          <span className="material-icons" aria-hidden="true">
            arrow_back
          </span>
          Volver
        </Button>
        {titulo && <h2 className="reproductor__titulo">{titulo}</h2>}
        <span className="reproductor__tiempo">
          {formatClock(progreso.posicion)} / {formatClock(progreso.duracion)}
        </span>
      </div>

      {error && <ErrorState message={error.message} />}

      <video
        ref={videoRef}
        className="reproductor__video"
        src={`/api/media/${tipoApi}/${id}/video/`}
        controls
        autoPlay
        onLoadedMetadata={alMetadatos}
        onTimeUpdate={alTiempo}
        onEnded={alTerminar}
        onError={() => setError(new Error('No se pudo cargar el vídeo.'))}
        onPlaying={() => setError(null)}
      />
    </div>
  )
}

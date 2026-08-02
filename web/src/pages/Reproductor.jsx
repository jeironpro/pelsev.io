import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '../components/common/ErrorState'
import VideoPlayer from '../components/player/VideoPlayer'
import { progressService } from '../services/progressService'

import './reproductor.css'

// Conversión de tipo de ruta a tipo de la API.
const API_TYPES = {
  pelicula: 'movie',
  episodio: 'episode',
}

// Guarda el progreso como mucho cada 5 segundos.
const SAVE_INTERVAL = 5

// Página de reproducción: guarda y reanuda el estado de visualización.
export default function Reproductor() {
  const { tipo, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const lastSaved = useRef(0)
  const lastPositionRef = useRef(0)
  const lastDurationRef = useRef(0)

  const [error, setError] = useState(null)
  const [resumePosition, setResumePosition] = useState(0)
  const apiType = API_TYPES[tipo]
  const title = location.state?.title

  // Recupera la última posición guardada para reanudar.
  useEffect(() => {
    let active = true
    async function restore() {
      try {
        const lista = await progressService.continueWatching()
        const item = lista.find(
          (x) => x.type === apiType && x.content_id === Number(id)
        )
        if (active && item) {
          setResumePosition(item.position_sec)
        }
      } catch {
        // Si falla la recuperación, se empieza desde el principio.
      }
    }
    if (apiType) {
      restore()
    }
    return () => {
      active = false
    }
  }, [apiType, id])

  // Guarda el progreso actual en la API.
  const save = useCallback(
    (position, duration, completed = false) => {
      if (!duration) return
      const finished = completed || position >= duration - 5
      progressService.save({
        type: apiType,
        contentId: Number(id),
        positionSec: Math.round(position),
        durationSec: Math.round(duration),
        completed: finished,
      })
    },
    [apiType, id]
  )

  // Guarda durante la reproducción, como mucho cada 5 segundos.
  const handleTimeUpdate = useCallback(
    (position, duration) => {
      lastPositionRef.current = position
      lastDurationRef.current = duration
      if (position - lastSaved.current >= SAVE_INTERVAL) {
        lastSaved.current = position
        save(position, duration)
      }
    },
    [save]
  )

  // Guarda al salir de la página con la última posición conocida.
  const handleExit = useCallback(() => {
    if (lastDurationRef.current) {
      save(lastPositionRef.current, lastDurationRef.current)
    }
  }, [save])

  useEffect(() => {
    const handleVisibilityChange = () => handleExit()
    window.addEventListener('beforeunload', handleExit)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      handleExit()
      window.removeEventListener('beforeunload', handleExit)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleExit])

  if (!apiType) {
    return (
      <div className="player">
        <ErrorState message="Tipo de contenido no válido." />
      </div>
    )
  }

  return (
    <div className="player">
      {error && <ErrorState message={error.message} />}

      <VideoPlayer
        src={`/api/media/${apiType}/${id}/video/`}
        title={title}
        initialPosition={resumePosition}
        onBack={() => navigate(-1)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() =>
          save(lastPositionRef.current, lastDurationRef.current, true)
        }
        onError={() => setError(new Error('No se pudo cargar el vídeo.'))}
      />
    </div>
  )
}

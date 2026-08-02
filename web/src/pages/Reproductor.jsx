import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ErrorState from '../components/common/ErrorState'
import VideoPlayer from '../components/player/VideoPlayer'
import Button from '../components/ui/Button'
import { progressService } from '../services/progressService'

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

  const ultimoGuardado = useRef(0)
  const ultimaPosicionRef = useRef(0)
  const ultimaDuracionRef = useRef(0)

  const [error, setError] = useState(null)
  const [posicionReanudar, setPosicionReanudar] = useState(0)
  const tipoApi = TIPOS_API[tipo]
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
          setPosicionReanudar(item.position_sec)
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
    (posicion, duracion, completado = false) => {
      if (!duracion) return
      const finalizado = completado || posicion >= duracion - 5
      progressService.save({
        type: tipoApi,
        contentId: Number(id),
        positionSec: Math.round(posicion),
        durationSec: Math.round(duracion),
        completed: finalizado,
      })
    },
    [tipoApi, id]
  )

  // Guarda durante la reproducción, como mucho cada 5 segundos.
  const alTiempo = useCallback(
    (posicion, duracion) => {
      ultimaPosicionRef.current = posicion
      ultimaDuracionRef.current = duracion
      if (posicion - ultimoGuardado.current >= INTERVALO_GUARDADO) {
        ultimoGuardado.current = posicion
        guardar(posicion, duracion)
      }
    },
    [guardar]
  )

  // Guarda al salir de la página con la última posición conocida.
  const alSalir = useCallback(() => {
    if (ultimaDuracionRef.current) {
      guardar(ultimaPosicionRef.current, ultimaDuracionRef.current)
    }
  }, [guardar])

  useEffect(() => {
    const alOcultar = () => alSalir()
    window.addEventListener('beforeunload', alSalir)
    document.addEventListener('visibilitychange', alOcultar)
    return () => {
      alSalir()
      window.removeEventListener('beforeunload', alSalir)
      document.removeEventListener('visibilitychange', alOcultar)
    }
  }, [alSalir])

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
      </div>

      {error && <ErrorState message={error.message} />}

      <VideoPlayer
        src={`/api/media/${tipoApi}/${id}/video/`}
        titulo={titulo}
        initialPosition={posicionReanudar}
        onTimeUpdate={alTiempo}
        onEnded={() =>
          guardar(ultimaPosicionRef.current, ultimaDuracionRef.current, true)
        }
        onError={() => setError(new Error('No se pudo cargar el vídeo.'))}
      />
    </div>
  )
}

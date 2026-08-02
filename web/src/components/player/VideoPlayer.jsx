import { useCallback, useEffect, useRef, useState } from 'react'

import Spinner from '../ui/Spinner'
import { formatClock } from '../../utils/format'

import './VideoPlayer.css'

const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
const OCULTAR_CONTROLES_MS = 3000

// Reproductor de vídeo propio con controles personalizados.
export default function VideoPlayer({
  src,
  titulo,
  initialPosition = 0,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  onError,
}) {
  const contenedorRef = useRef(null)
  const videoRef = useRef(null)
  const ocultarTimer = useRef(null)
  const reanudadoRef = useRef(false)
  const buscandoRef = useRef(false)

  const [reproduciendo, setReproduciendo] = useState(false)
  const [finalizado, setFinalizado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [mostrarControles, setMostrarControles] = useState(true)
  const [posicion, setPosicion] = useState(0)
  const [duracion, setDuracion] = useState(0)
  const [volumen, setVolumen] = useState(1)
  const [silenciado, setSilenciado] = useState(false)
  const [velocidad, setVelocidad] = useState(1)

  // Muestra los controles y programa su ocultación al reproducir.
  const mostrar = useCallback(() => {
    setMostrarControles(true)
    clearTimeout(ocultarTimer.current)
    const video = videoRef.current
    if (video && !video.paused) {
      ocultarTimer.current = setTimeout(
        () => setMostrarControles(false),
        OCULTAR_CONTROLES_MS
      )
    }
  }, [])

  useEffect(() => {
    return () => clearTimeout(ocultarTimer.current)
  }, [])

  const alternar = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
    mostrar()
  }, [mostrar])

  const saltar = useCallback(
    (segundos) => {
      const video = videoRef.current
      if (!video) return
      video.currentTime = Math.max(0, video.currentTime + segundos)
      mostrar()
    },
    [mostrar]
  )

  const alternarMudo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const nuevo = !video.muted
    video.muted = nuevo
    setSilenciado(nuevo)
    if (!nuevo && video.volume === 0) {
      video.volume = 1
      setVolumen(1)
    }
    mostrar()
  }, [mostrar])

  const cambiarVolumen = useCallback((valor) => {
    const video = videoRef.current
    setVolumen(valor)
    setSilenciado(valor === 0)
    if (video) {
      video.volume = valor
      video.muted = valor === 0
    }
  }, [])

  const cambiarVelocidad = useCallback(
    (valor) => {
      setVelocidad(valor)
      if (videoRef.current) videoRef.current.playbackRate = valor
      mostrar()
    },
    [mostrar]
  )

  const alternarPantallaCompleta = useCallback(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return
    if (!document.fullscreenElement) {
      contenedor.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    mostrar()
  }, [mostrar])

  const alTeclado = useCallback(
    (event) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          alternar()
          break
        case 'ArrowRight':
          saltar(5)
          break
        case 'ArrowLeft':
          saltar(-5)
          break
        case 'KeyM':
          alternarMudo()
          break
        case 'KeyF':
          alternarPantallaCompleta()
          break
        default:
          break
      }
    },
    [alternar, saltar, alternarMudo, alternarPantallaCompleta]
  )

  const alMetadatos = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setDuracion(video.duration)
    onLoadedMetadata?.(video.duration)
    if (initialPosition > 0 && !reanudadoRef.current) {
      video.currentTime = Math.min(initialPosition, video.duration - 5)
      reanudadoRef.current = true
    }
  }, [initialPosition, onLoadedMetadata])

  // Reanuda si la posición llega después de cargar los metadatos.
  useEffect(() => {
    const video = videoRef.current
    if (!video || reanudadoRef.current || video.readyState < 1) return
    if (initialPosition > 0) {
      video.currentTime = Math.min(initialPosition, video.duration - 5)
      reanudadoRef.current = true
    }
  }, [initialPosition])

  const alTiempo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (!buscandoRef.current) {
      setPosicion(video.currentTime)
    }
    onTimeUpdate?.(video.currentTime, video.duration)
  }, [onTimeUpdate])

  const alBuscar = useCallback(
    (event) => {
      const video = videoRef.current
      const valor = Number(event.target.value)
      if (video) video.currentTime = valor
      setPosicion(valor)
      onTimeUpdate?.(valor, duracion)
    },
    [duracion, onTimeUpdate]
  )

  return (
    <div
      className={`reproductor-video ${
        mostrarControles ? 'reproductor-video--controles' : ''
      }`}
      ref={contenedorRef}
      onMouseMove={mostrar}
      onKeyDown={alTeclado}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="reproductor-video__elemento"
        src={src}
        preload="auto"
        autoPlay
        onClick={alternar}
        onPlay={() => {
          setReproduciendo(true)
          setFinalizado(false)
          mostrar()
        }}
        onPause={() => {
          setReproduciendo(false)
          setMostrarControles(true)
        }}
        onTimeUpdate={alTiempo}
        onLoadedMetadata={alMetadatos}
        onEnded={() => {
          setFinalizado(true)
          onEnded?.()
        }}
        onWaiting={() => setCargando(true)}
        onPlaying={() => setCargando(false)}
        onError={onError}
      />

      {cargando && (
        <div className="reproductor-video__cargando">
          <Spinner label="" />
        </div>
      )}

      {!cargando && !reproduciendo && (
        <button
          type="button"
          className="reproductor-video__play-grande"
          onClick={alternar}
          aria-label={finalizado ? 'Reanudar' : 'Reproducir'}
        >
          <span className="material-icons" aria-hidden="true">
            {finalizado ? 'replay' : 'play_arrow'}
          </span>
        </button>
      )}

      {mostrarControles && (
        <>
          <div className="reproductor-video__barra-superior">
            {titulo && <h2 className="reproductor-video__titulo">{titulo}</h2>}
            <button
              type="button"
              className="reproductor-video__boton"
              onClick={alternarPantallaCompleta}
              aria-label="Pantalla completa"
            >
              <span className="material-icons" aria-hidden="true">
                fullscreen
              </span>
            </button>
          </div>

          <div className="reproductor-video__barra-inferior">
            <input
              type="range"
              className="reproductor-video__progreso"
              min={0}
              max={duracion || 0}
              step={1}
              value={posicion}
              style={{
                '--progreso': duracion ? `${(posicion / duracion) * 100}%` : '0%',
              }}
              onChange={alBuscar}
              onMouseDown={() => {
                buscandoRef.current = true
              }}
              onMouseUp={() => {
                buscandoRef.current = false
              }}
              onBlur={() => {
                buscandoRef.current = false
              }}
              aria-label="Barra de progreso"
            />

            <div className="reproductor-video__controles">
              <button
                type="button"
                className="reproductor-video__boton"
                onClick={alternar}
                aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}
              >
                <span className="material-icons" aria-hidden="true">
                  {reproduciendo ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                type="button"
                className="reproductor-video__boton"
                onClick={() => saltar(-10)}
                aria-label="Retroceder 10 segundos"
              >
                <span className="material-icons" aria-hidden="true">
                  replay_10
                </span>
              </button>

              <button
                type="button"
                className="reproductor-video__boton"
                onClick={() => saltar(10)}
                aria-label="Avanzar 10 segundos"
              >
                <span className="material-icons" aria-hidden="true">
                  forward_10
                </span>
              </button>

              <div className="reproductor-video__volumen">
                <button
                  type="button"
                  className="reproductor-video__boton"
                  onClick={alternarMudo}
                  aria-label={silenciado ? 'Activar sonido' : 'Silenciar'}
                >
                  <span className="material-icons" aria-hidden="true">
                    {silenciado || volumen === 0 ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <input
                  type="range"
                  className="reproductor-video__control-volumen"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volumen}
                  style={{ '--volumen': `${volumen * 100}%` }}
                  onChange={(event) => cambiarVolumen(Number(event.target.value))}
                  aria-label="Volumen"
                />
              </div>

              <span className="reproductor-video__tiempo">
                {formatClock(posicion)} / {formatClock(duracion)}
              </span>

              <select
                className="reproductor-video__velocidad"
                value={velocidad}
                onChange={(event) => cambiarVelocidad(Number(event.target.value))}
                aria-label="Velocidad de reproducción"
              >
                {VELOCIDADES.map((valor) => (
                  <option key={valor} value={valor}>
                    {valor}x
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

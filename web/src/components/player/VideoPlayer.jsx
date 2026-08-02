import { useCallback, useEffect, useRef, useState } from 'react'

import Spinner from '../ui/Spinner'
import { formatClock } from '../../utils/format'

import './VideoPlayer.css'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
const HIDE_CONTROLS_MS = 3000

// Reproductor de vídeo propio con controles personalizados.
export default function VideoPlayer({
  src,
  title,
  initialPosition = 0,
  onBack,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  onError,
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const hideTimer = useRef(null)
  const resumedRef = useRef(false)
  const seekingRef = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(1)

  // Muestra los controles y programa su ocultación al reproducir.
  const show = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    const video = videoRef.current
    if (video && !video.paused) {
      hideTimer.current = setTimeout(
        () => setShowControls(false),
        HIDE_CONTROLS_MS
      )
    }
  }, [])

  useEffect(() => {
    return () => clearTimeout(hideTimer.current)
  }, [])

  const toggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
    show()
  }, [show])

  const seek = useCallback(
    (seconds) => {
      const video = videoRef.current
      if (!video) return
      video.currentTime = Math.max(0, video.currentTime + seconds)
      show()
    },
    [show]
  )

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const nuevo = !video.muted
    video.muted = nuevo
    setMuted(nuevo)
    if (!nuevo && video.volume === 0) {
      video.volume = 1
      setVolume(1)
    }
    show()
  }, [show])

  const changeVolume = useCallback((value) => {
    const video = videoRef.current
    setVolume(value)
    setMuted(value === 0)
    if (video) {
      video.volume = value
      video.muted = value === 0
    }
  }, [])

  const changeSpeed = useCallback(
    (value) => {
      setSpeed(value)
      if (videoRef.current) videoRef.current.playbackRate = value
      show()
    },
    [show]
  )

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    show()
  }, [show])

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          toggle()
          break
        case 'ArrowRight':
          seek(5)
          break
        case 'ArrowLeft':
          seek(-5)
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyF':
          toggleFullscreen()
          break
        default:
          break
      }
    },
    [toggle, seek, toggleMute, toggleFullscreen]
  )

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
    onLoadedMetadata?.(video.duration)
    if (initialPosition > 0 && !resumedRef.current) {
      video.currentTime = Math.min(initialPosition, video.duration - 5)
      resumedRef.current = true
    }
  }, [initialPosition, onLoadedMetadata])

  // Reanuda si la posición llega después de cargar los metadatos.
  useEffect(() => {
    const video = videoRef.current
    if (!video || resumedRef.current || video.readyState < 1) return
    if (initialPosition > 0) {
      video.currentTime = Math.min(initialPosition, video.duration - 5)
      resumedRef.current = true
    }
  }, [initialPosition])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (!seekingRef.current) {
      setPosition(video.currentTime)
    }
    onTimeUpdate?.(video.currentTime, video.duration)
  }, [onTimeUpdate])

  const handleSeek = useCallback(
    (event) => {
      const video = videoRef.current
      const value = Number(event.target.value)
      if (video) video.currentTime = value
      setPosition(value)
      onTimeUpdate?.(value, duration)
    },
    [duration, onTimeUpdate]
  )

  return (
    <div
      className={`video-player ${
        showControls ? 'video-player--controls' : ''
      }`}
      ref={containerRef}
      onMouseMove={show}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="video-player__element"
        src={src}
        preload="auto"
        autoPlay
        onClick={toggle}
        onPlay={() => {
          setPlaying(true)
          setFinished(false)
          show()
        }}
        onPause={() => {
          setPlaying(false)
          setShowControls(true)
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setFinished(true)
          onEnded?.()
        }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onError={onError}
      />

      {loading && (
        <div className="video-player__loading">
          <Spinner label="" />
        </div>
      )}

      {!loading && !playing && (
        <button
          type="button"
          className="video-player__big-play"
          onClick={toggle}
          aria-label={finished ? 'Reanudar' : 'Reproducir'}
        >
          <span className="material-icons" aria-hidden="true">
            {finished ? 'replay' : 'play_arrow'}
          </span>
        </button>
      )}

      {showControls && (
        <>
          <div className="video-player__top-bar">
            {onBack && (
              <button
                type="button"
                className="video-player__button"
                onClick={onBack}
                aria-label="Volver"
              >
                <span className="material-icons" aria-hidden="true">
                  arrow_back
                </span>
              </button>
            )}
            {title && <h2 className="video-player__title">{title}</h2>}
            <button
              type="button"
              className="video-player__button"
              onClick={toggleFullscreen}
              aria-label="Pantalla completa"
            >
              <span className="material-icons" aria-hidden="true">
                fullscreen
              </span>
            </button>
          </div>

          <div className="video-player__bottom-bar">
            <input
              type="range"
              className="video-player__progress"
              min={0}
              max={duration || 0}
              step={1}
              value={position}
              style={{
                '--progress': duration ? `${(position / duration) * 100}%` : '0%',
              }}
              onChange={handleSeek}
              onMouseDown={() => {
                seekingRef.current = true
              }}
              onMouseUp={() => {
                seekingRef.current = false
              }}
              onBlur={() => {
                seekingRef.current = false
              }}
              aria-label="Barra de progreso"
            />

            <div className="video-player__controls">
              <button
                type="button"
                className="video-player__button"
                onClick={toggle}
                aria-label={playing ? 'Pausar' : 'Reproducir'}
              >
                <span className="material-icons" aria-hidden="true">
                  {playing ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                type="button"
                className="video-player__button"
                onClick={() => seek(-10)}
                aria-label="Retroceder 10 segundos"
              >
                <span className="material-icons" aria-hidden="true">
                  replay_10
                </span>
              </button>

              <button
                type="button"
                className="video-player__button"
                onClick={() => seek(10)}
                aria-label="Avanzar 10 segundos"
              >
                <span className="material-icons" aria-hidden="true">
                  forward_10
                </span>
              </button>

              <div className="video-player__volume">
                <button
                  type="button"
                  className="video-player__button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                >
                  <span className="material-icons" aria-hidden="true">
                    {muted || volume === 0 ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
                <input
                  type="range"
                  className="video-player__volume-control"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  style={{ '--volume': `${volume * 100}%` }}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  aria-label="Volumen"
                />
              </div>

              <span className="video-player__time">
                {formatClock(position)} / {formatClock(duration)}
              </span>

              <select
                className="video-player__speed"
                value={speed}
                onChange={(event) => changeSpeed(Number(event.target.value))}
                aria-label="Velocidad de reproducción"
              >
                {SPEEDS.map((value) => (
                  <option key={value} value={value}>
                    {value}x
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

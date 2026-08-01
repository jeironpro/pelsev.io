# Arquitectura del backend de pelsev.io

## Visión general

El backend es una API REST construida con **Django** y **Django REST Framework**. Sirve el catálogo (películas y series) a partir de una carpeta `media/` y gestiona el progreso de reproducción de un único usuario.

```
                     ┌────────────────────────────────┐
 Clientes (web/movil)│      Django / DRF (pelsevio)    │
   (futuro React) ──►│                                │
                     │  catalog ──► modelos ──► SQLite  │
                     │  playback ─► Progress           │
                     │  core ──► scan_media + media     │
                     └───────────────┬────────────────┘
                                     │
                     ┌───────────────▼────────────────┐
                     │        media/ (ficheros)        │
                     │  vídeos + miniaturas (ffprobe)  │
                     └────────────────────────────────┘
```

## Capas y aplicaciones

| App | Responsabilidad |
| --- | --- |
| `apps.catalog` | Modelos y API del catálogo: `Category`, `Saga`, `Movie`, `Series`, `Season`, `Episode`. |
| `apps.playback` | Modelo y API del progreso: `Progress` y el endpoint "Continuar viendo". |
| `apps.core` | Comando `scan_media`, utilidades de media (ffprobe/ffmpeg) y entrega de archivos con soporte Range. |

## Modelo de datos

```
Category (slug, name)
    ▲                     Saga (slug, title)
    │ M2M                 │ 1:N
Movie ────────────────► Saga (saga nullable, order_in_saga)
Series (slug, title, thumbnail)
    │ 1:N
Season (number)
    │ 1:N
Episode (number, title, video, thumbnail, duration_sec)
```

- `Progress` apunta a una `Movie` **o** un `Episode` (solo uno de los dos).
- Los campos `video` y `thumbnail` guardan la **ruta relativa** a `MEDIA_ROOT`.

## Escaneo de la carpeta media

El comando `python manage.py scan_media` recorre `MEDIA_ROOT` de forma **idempotente**:

1. Detecta la estructura (`movies/`, `movies/<saga>/movies/`, `series/<t>/<temporada>/`).
2. Lee la duración de cada vídeo con `ffprobe`.
3. Crea o actualiza los registros (`update_or_create`).
4. Elimina registros obsoletos que ya no existen en disco.

La convención de carpetas está documentada en el [README](../README.md#contenido-media).

## Entrega de media

Los vídeos no se sirven desde el servidor de aplicación en producción ideal, pero en esta v1 se exponen con soporte **HTTP Range** (seeking) para que el reproductor `<video>` funcione:

- `GET /api/media/{movie|episode}/{id}/video/`
- `GET /api/media/{movie|episode|series}/{id}/thumbnail/`

## Reproducción y "Continuar viendo"

- El frontend envía la posición periódicamente con `POST /api/playback/progress/` (`type`, `content_id`, `position_sec`, `duration_sec`, `completed`).
- El endpoint `GET /api/playback/progress/continue-watching/` devuelve los contenidos en curso (posición > 0 y no completados) ordenados por última visualización.
- `DELETE /api/playback/progress/{id}/` elimina un elemento de la lista.
- Un contenido se marca como `completed` para dejar de aparecer.

## Calidad

- **Tests**: pytest + pytest-django en `tests/`.
- **Estilo**: flake8, black e isort (ver `setup.cfg`).
- **Documentación API**: Swagger/OpenAPI en `/api/docs/` (drf-spectacular).

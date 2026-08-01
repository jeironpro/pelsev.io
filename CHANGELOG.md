# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

### Añadido

- Backend Django REST Framework con el paquete del proyecto `pelsevio`.
- Modelos del catálogo: `Category`, `Saga`, `Movie`, `Series`, `Season` y `Episode`.
- Modelo de reproducción `Progress` para guardar la posición de visualización.
- Comando `scan_media`: escaneo idempotente de la carpeta `media/` con duración vía `ffprobe`.
- Generación de miniaturas desde el vídeo con ffmpeg (`--generate-thumbnails`).
- API de catálogo: listados y detalles de películas, series, categorías y página de inicio.
- API de reproducción: guardar progreso, listar "Continuar viendo" y eliminarlo.
- Streaming de vídeo con soporte de peticiones HTTP Range (seek).
- Documentación Swagger/OpenAPI con drf-spectacular en `/api/docs/`.
- Panel de administración de Django para el catálogo y el progreso.
- Script `scripts/create_sample_media.sh` para generar contenido de ejemplo.
- Tests con pytest para el escaneo, el catálogo, la reproducción y el streaming.
- Configuración de estilo de código: flake8, black e isort.
- README con la puesta en marcha y la convención de la carpeta `media/`.

### Cambiado

- Reescribir el README genérico inicial con la documentación real del proyecto.

### Corregido

- Corrección del filtro de `update_or_create` del progreso (`**lookup`).

### Eliminado

- Contenido README genérico de portafolio.

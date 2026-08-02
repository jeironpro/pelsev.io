# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).

## [Unreleased]

### Añadido

- Reproductor de vídeo propio con controles personalizados: play/pausa, saltos de ±10s, barra de progreso, volumen, velocidad de reproducción, pantalla completa y atajos de teclado.
- Página de categoría con las películas y series asociadas.
- Tarjetas de categorías en la página de inicio (antes de "Continuar viendo").
- Categorías por defecto creadas por migración aunque aún no tengan contenido.

- Generación de miniaturas para series, temporadas y cada episodio con `scan_media --generate-thumbnails` (desde el vídeo de cada uno).
- Limpieza de sagas huérfanas (sin películas) al reescanear.
- Frontend web en React + Vite con el proyecto `pelsevio-web` en `web/`.
- Libro de estilo y diseño visual (`web/docs/libro-de-estilo.md`) con variables CSS y componentes reutilizables.
- Páginas de inicio, listados de películas y series, y detalle de contenido (con temporadas y episodios).
- Reproductor de vídeo con guardado automático de progreso y reanudación (seek).
- Página "Continuar viendo" con opción de eliminar del historial.
- Ajustes para limpiar el historial de reproducción.
- Tests con Vitest y React Testing Library (17 tests).
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
- Configuración del backend unificada en `pyproject.toml` (dependencias, pytest, flake8, black e isort).
- Lockfiles `requirements.txt` y `test-requirements.txt` generados desde `pyproject.toml` con pip-tools.
- Yarn como gestor de paquetes del frontend con la versión fijada en `package.json` (Corepack) y lockfile `yarn.lock`.
- Hooks de pre-commit con lint y formato para backend (black, isort, flake8) y frontend (eslint, prettier) más validaciones básicas.
- Contenerización Docker: Dockerfile multistage para backend (Python + ffmpeg + gunicorn) y frontend (Yarn build → Nginx), docker-compose.yml con volúmenes persistentes para DB y media.
- CI/CD con GitHub Actions: flujo `ci` (tests y lint en backend/frontend, ffmpeg en el entorno) y flujo `docker-build` (validación de imágenes).

### Cambiado

- El escaneo agrupa las series en carpetas de categoría (`media/series/<categoria>/...`) y asigna la categoría desde la carpeta.
- Cabecera flotante rediseñada sin el icono de perfil.
- Panel lateral flotante siempre visible, colapsado con iconos y expandible al pasar el ratón, con el perfil arriba y los ajustes abajo.
- La página de inicio muestra una sección por cada categoría aunque esté vacía.
- Reescribir el README genérico inicial con la documentación real del proyecto.
- Dependencias del backend gestionadas desde `pyproject.toml`: los lockfiles `requirements.txt` y `test-requirements.txt` ahora se generan con pip-tools en lugar de mantenerse a mano.
- Frontend: se sustituye npm por Yarn (Corepack) para la instalación y ejecución de scripts.

### Corregido

- Generación de miniaturas para series y temporadas con `scan_media --generate-thumbnails`.
- Limpieza de sagas huérfanas al reescanear (sin películas en disco).
- Alineado el frontend con las claves en inglés de la API (crash de la página de inicio).
- Adoptados los future flags `v7_startTransition` y `v7_relativeSplatPath` de React Router.
- Corrección del filtro de `update_or_create` del progreso (`**lookup`).

### Eliminado

- Contenido README genérico de portafolio.
- Archivos de configuración del backend en favor de `pyproject.toml`: `requirements.txt`/`requirements-dev.txt` manuales, `setup.cfg` y `pytest.ini`.

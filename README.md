# pelsev.io

Plataforma de streaming estilo Netflix para películas y series. En su primera versión (v1) cuenta con un **backend API REST** y un **frontend web** (React + Vite).

El contenido se carga automáticamente desde una carpeta `media/` mediante un comando de escaneo que detecta películas, sagas, series, temporadas y episodios, leyendo su duración con `ffprobe`.

## Características (v1)

- **Catálogo automático**: escaneo idempotente de la carpeta `media/` (películas, sagas, series, temporadas y episodios).
- **Frontend web**: React + Vite con libro de estilo, páginas de catálogo, detalle de contenido y reproductor.
- **Reproducción con estado**: se guarda la posición (minuto) de cada película o episodio y se reanuda al volver.
- **Continuar viendo**: listado de los contenidos en curso con posición y tiempo restante, y opción de eliminarlos.
- **Streaming por rangos**: los vídeos se sirven con soporte HTTP Range (seek), listos para el reproductor de vídeo.
- **Sin autenticación**: v1 pensada para un único usuario (el progreso se guarda globalmente).
- **Panel de administración** de Django para editar el catálogo manualmente.

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | Python, Django 6, Django REST Framework |
| API | drf-spectacular (Swagger/OpenAPI), django-filter |
| Frontend | React 18, Vite, React Router |
| Estilo web | CSS variables, Material Icons, Prettier, ESLint |
| Media | ffmpeg / ffprobe (duración y miniaturas) |
| Tests | pytest, pytest-django (backend) y Vitest + Testing Library (web) |
| Estilo | flake8, black, isort (backend) |

## Estructura del repositorio

```
pelsev.io/
├── backend/            # API REST (Django + DRF)
│   ├── apps/
│   │   ├── catalog/    # Categorías, sagas, películas, series, temporadas, episodios
│   │   ├── playback/   # Progreso de reproducción y "Continuar viendo"
│   │   └── core/       # Comando scan_media y entrega de media
│   ├── config/         # Routers de la API y Swagger
│   ├── pelsevio/       # Configuración del proyecto Django
│   ├── media/          # Contenido: películas y series
│   ├── scripts/        # Utilidades (generación de contenido de ejemplo)
│   └── tests/          # Tests (pytest)
└── web/                # Frontend React + Vite
    ├── src/
    │   ├── components/ # Componentes de interfaz (tarjetas, layout, UI)
    │   ├── context/    # Estado global (sidebar)
    │   ├── hooks/      # Hooks (useFetch)
    │   ├── pages/      # Páginas (home, catálogo, detalle, reproductor, ajustes)
    │   ├── services/   # Clientes de la API
    │   ├── styles/     # Variables CSS y estilos globales
    │   └── utils/      # Utilidades de formato
    ├── docs/           # Libro de estilo
    └── tests/          # Tests (Vitest + Testing Library)
```

## Puesta en marcha (backend)

Requisitos: Python 3.12+, `ffmpeg` y `ffprobe` en el PATH.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"    # incluye dependencias de desarrollo (tests y lint)
cp .env.example .env
```

### Contenido media

Crea la estructura de carpetas bajo `backend/media/` con esta convención:

```
media/
├── movies/
│   ├── el-padrino/                      # película individual
│   │   ├── video.mp4
│   │   └── thumbnail.jpg
│   └── star-wars/                       # saga (contiene subcarpeta movies/)
│       ├── thumbnail.jpg
│       └── movies/
│           ├── una-nueva-esperanza/video.mp4
│           └── el-imperio-contraataca/video.mp4
└── series/
    └── anime/                           # carpeta de categoría (de aquí se toma la categoría)
        └── naruto/
            ├── thumbnail.jpg            # opcional (se genera con --generate-thumbnails)
            └── temporada_1_el_pais_de_las_olas/   # la temporada se detecta por su número
                ├── episodio-1.mp4       # episodio 1 (también valen 001.mp4, episode-1.mp4)
                └── episodio-2.mp4
```

Las series se agrupan en una carpeta por categoría (`media/series/<categoria>/<serie>/...`); la categoría se crea u obtiene a partir del nombre de esa carpeta y se asigna a cada serie del interior. Las carpetas de temporada se detectan por el número del nombre (p. ej. `season-1`, `temporada_1_...`) y los episodios por el número del archivo (p. ej. `episode-1.mp4`, `001.mp4`). Las carpetas de temporada vacías se ignoran.

Para generar contenido de ejemplo de forma rápida:

```bash
bash scripts/create_sample_media.sh
```

### Migraciones y escaneo

```bash
python manage.py migrate
python manage.py scan_media              # puebla el catálogo desde media/
python manage.py scan_media --generate-thumbnails   # además crea miniaturas desde el vídeo
```

`--generate-thumbnails` crea `thumbnail.jpg` para películas, series y temporadas, y una miniatura propia (`<nombre>.jpg`) para cada episodio desde su propio vídeo.

### Servidor

```bash
python manage.py runserver
```

- API: <http://localhost:8000/api/catalog/home/>
- Swagger: <http://localhost:8000/api/docs/>
- Admin: <http://localhost:8000/admin/>

### Tests y lint

```bash
python -m pytest
black . && isort . && flake8
```

## Puesta en marcha (frontend web)

Requisitos: Node.js 20+ y npm. El backend debe estar en marcha en el puerto 8000 (el servidor de desarrollo hace proxy de `/api`).

```bash
cd web
npm install
npm run dev          # http://localhost:5173
```

### Tests, lint y formato (web)

```bash
npm run test:run     # Vitest (una ejecución)
npm run lint         # ESLint
npm run format       # Prettier (reescribe)
npm run build        # build de producción
```

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/catalog/home/` | Categorías con contenido y sagas (inicio) |
| GET | `/api/catalog/movies/` | Listado de películas (filtro `?category=`) |
| GET | `/api/catalog/movies/{id}/` | Detalle de película |
| GET | `/api/catalog/series/` | Listado de series |
| GET | `/api/catalog/series/{id}/` | Detalle con temporadas, episodios y progreso |
| GET | `/api/playback/progress/continue-watching/` | Contenidos en curso |
| POST | `/api/playback/progress/` | Guardar posición (`type`, `content_id`, `position_sec`, ...) |
| DELETE | `/api/playback/progress/{id}/` | Quitar de "Continuar viendo" |
| GET | `/api/media/{type}/{id}/video/` | Vídeo con soporte Range (`movie` o `episode`) |
| GET | `/api/media/{type}/{id}/thumbnail/` | Miniatura (`movie`, `episode` o `series`) |

## Roadmap

- [x] Backend: catálogo, escaneo de media y streaming
- [x] Backend: progreso de reproducción y "Continuar viendo"
- [x] Frontend web: React + Vite (layout, catálogo y reproductor)
- [x] Libro de estilo
- [ ] Autenticación de usuarios

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE).

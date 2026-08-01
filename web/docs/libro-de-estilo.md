# Libro de estilo de pelsev.io (web)

Guía visual de la aplicación web. Define la identidad, los colores, la tipografía y los componentes para mantener una experiencia coherente en todo el catálogo.

## Marca

- **Nombre**: pelsev.io
- **Concepto**: plataforma de streaming de películas y series. Estética cinematográfica, oscura y sobria, con un acento vibrante que guía la atención.

## Paleta de color

| Token                        | Valor     | Uso                                      |
| ---------------------------- | --------- | ---------------------------------------- |
| `--color-fondo`              | `#0b0b0c` | Fondo principal de la aplicación         |
| `--color-superficie`         | `#161618` | Superficies (tarjetas, sidebar)          |
| `--color-superficie-elevada` | `#202024` | Elementos elevados (menús, hover)        |
| `--color-borde`              | `#2a2a30` | Separadores y bordes sutiles             |
| `--color-texto`              | `#f5f5f7` | Texto principal                          |
| `--color-texto-secundario`   | `#a1a1aa` | Texto secundario (duraciones, metadatos) |
| `--color-acento`             | `#e50914` | Acciones y barras de progreso            |
| `--color-acento-hover`       | `#f6121d` | Hover del acento                         |
| `--color-exito`              | `#22c55e` | Estados completados                      |

Regla de contraste: sobre el fondo oscuro se usa texto claro; nunca texto secundario sobre el acento. El acento se reserva para acciones, el reproductor y el progreso.

## Tipografía

- **Fuente de títulos**: `Bebas Neue` (impacto cinematográfico, mayúsculas).
- **Fuente del cuerpo**: `Inter` (legibilidad en textos largos y metadatos).
- **Iconos**: Material Icons (fuente externa de Google).

| Token                     | Valor                    | Uso                              |
| ------------------------- | ------------------------ | -------------------------------- |
| `--tamano-titulo-hero`    | `clamp(2rem, 6vw, 4rem)` | Título del detalle de contenido  |
| `--tamano-titulo-seccion` | `1.25rem`                | Encabezados de filas y secciones |
| `--tamano-titulo-tarjeta` | `0.95rem`                | Título dentro de tarjetas        |
| `--tamano-cuerpo`         | `0.9rem`                 | Cuerpo de texto                  |
| `--tamano-pequeno`        | `0.8rem`                 | Metadatos y etiquetas            |

## Espaciado y geometría

- Escala de espacio: `0.25 / 0.5 / 1 / 1.5 / 2.5rem` (tokens `--espacio-*`).
- Radios de borde: `4 / 8 / 12px`.
- La cabecera tiene altura fija de `64px`.
- Sombra de tarjeta y sombra flotante (hover) según tokens `--sombra-*`.

## Responsividad

La interfaz usa **media queries** con estos puntos de corte:

| Breakpoint | Valor     | Comportamiento                                                    |
| ---------- | --------- | ----------------------------------------------------------------- |
| Móvil      | `≤ 480px` | Tarjetas grandes a pantalla completa, sidebar a pantalla completa |
| Tablet     | `≤ 768px` | Dos tarjetas visibles por fila                                    |
| Escritorio | `> 768px` | Tres o más tarjetas por fila                                      |

## Componentes

### Cabecera (Header)

- **Izquierda**: logo de la marca e icono de perfil (despliega el sidebar).
- **Centro**: navegación principal (Películas, Series).
- **Derecha**: icono de configuración.
- Posición fija arriba, fondo con ligera transparencia.

### Panel lateral (Sidebar)

- Colapsado por defecto y superpuesto al contenido.
- Se abre con el icono de perfil y se cierra al hacer clic fuera o en una ruta.
- En móvil ocupa toda la pantalla; en escritorio es un panel deslizante.

### Tarjeta de contenido (ContentCard)

- Miniatura de relleno, **título centrado en la parte inferior** y barra de progreso opcional bajo la tarjeta.
- **Scroll horizontal** con animación suave (`scroll-snap`) y efecto **flotante** al pasar el ratón (la tarjeta se eleva).
- Ancho fijo (varias visibles por fila), que varía con los breakpoints.

### Tarjeta de episodio (EpisodeCard)

- Muestra título, duración y estado (minutos vistos).
- Barra de progreso en la parte inferior.

### Tarjeta de temporada (SeasonCard)

- Tarjeta rectangular pequeña; la seleccionada queda resaltada con el acento.

### Barra de progreso (ProgressBar)

- Barra fina horizontal; el relleno usa `--color-acento` y el ancho representa el porcentaje visto.

### Detalle de película

- Miniatura a pantalla completa de fondo con opacidad.
- Icono de reproducción centrado y, debajo, la duración.
- Título en la esquina superior izquierda.

### Detalle de serie

- Miniatura de fondo con opacidad y título.
- Temporadas como tarjetas rectangulares; al elegir una se muestran sus episodios.

## Iconografía

- Solo se usan **Material Icons** (no emojis ni imágenes en el código).
- Iconos disponibles: `account_circle`, `settings`, `play_arrow`, `close`, `movie`, `tv`, `home`, `history`, `delete`.

## Accesibilidad

- Contraste AA sobre fondo oscuro.
- Navegación con teclado en las filas horizontales (foco visible).
- Texto alternativo (`alt`) en miniaturas.

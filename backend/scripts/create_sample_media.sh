#!/usr/bin/env bash
# Genera contenido de ejemplo en la carpeta media para probar la plataforma.
# Requiere ffmpeg y ffprobe instalados.
set -euo pipefail

# Directorio raíz del backend (se resuelve desde la ubicación del script).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEDIA_ROOT="$SCRIPT_DIR/../media"

mkdir -p "$MEDIA_ROOT/movies/el-padrino" \
  "$MEDIA_ROOT/movies/star-wars/movies/una-nueva-esperanza" \
  "$MEDIA_ROOT/movies/star-wars/movies/el-imperio-contraataca" \
  "$MEDIA_ROOT/series/breaking-bad/season-1" \
  "$MEDIA_ROOT/series/breaking-bad/season-2"

# Crea un vídeo de prueba y su miniatura en el directorio indicado.
create_movie() {
  local dir="$1"
  ffmpeg -y -loglevel error -f lavfi -i testsrc=duration=6:size=320x180:rate=12 \
    -pix_fmt yuv420p "$dir/video.mp4"
  ffmpeg -y -loglevel error -i "$dir/video.mp4" -frames:v 1 -q:v 2 "$dir/thumbnail.jpg"
}

create_movie "$MEDIA_ROOT/movies/el-padrino"
create_movie "$MEDIA_ROOT/movies/star-wars/movies/una-nueva-esperanza"
create_movie "$MEDIA_ROOT/movies/star-wars/movies/el-imperio-contraataca"

ffmpeg -y -loglevel error -f lavfi -i testsrc=duration=4:size=320x180:rate=12 \
  -pix_fmt yuv420p "$MEDIA_ROOT/series/breaking-bad/season-1/episode-1.mp4"
ffmpeg -y -loglevel error -f lavfi -i testsrc=duration=5:size=320x180:rate=12 \
  -pix_fmt yuv420p "$MEDIA_ROOT/series/breaking-bad/season-1/episode-2.mp4"
ffmpeg -y -loglevel error -f lavfi -i testsrc=duration=3:size=320x180:rate=12 \
  -pix_fmt yuv420p "$MEDIA_ROOT/series/breaking-bad/season-2/episode-1.mp4"
ffmpeg -y -loglevel error -i "$MEDIA_ROOT/series/breaking-bad/season-1/episode-1.mp4" \
  -frames:v 1 -q:v 2 "$MEDIA_ROOT/series/breaking-bad/thumbnail.jpg"

echo "Contenido de ejemplo creado en $MEDIA_ROOT"

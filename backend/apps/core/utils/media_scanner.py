"""Utilidades para el escaneo de la carpeta media."""

import re
import subprocess
from pathlib import Path

VIDEO_EXTENSIONS = {".mp4", ".mkv", ".webm", ".avi"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def slug_to_title(slug):
    """Convierte un slug o nombre de archivo en un título legible."""
    text = slug.replace("_", " ").replace("-", " ").strip()
    return re.sub(r"\s+", " ", text).title()


def name_to_slug(name):
    """Normaliza el nombre de un directorio o archivo a slug."""
    return Path(name).stem.lower().replace(" ", "-")


def videos_in(directory):
    """Devuelve los archivos de vídeo de un directorio ordenados."""
    return sorted(
        p
        for p in Path(directory).iterdir()
        if p.is_file() and p.suffix.lower() in VIDEO_EXTENSIONS
    )


def image_in(directory):
    """Devuelve la primera imagen del directorio o None."""
    for p in sorted(Path(directory).iterdir()):
        if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS:
            return p
    return None


def image_named(directory, stem):
    """Devuelve la imagen con el nombre dado (sin extensión) o None."""
    for ext in IMAGE_EXTENSIONS:
        candidate = Path(directory) / f"{stem}{ext}"
        if candidate.is_file():
            return candidate
    return None


def duration_ffprobe(video_path):
    """Devuelve la duración en segundos de un vídeo usando ffprobe."""
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(video_path),
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        return int(float(result.stdout.strip()))
    except (subprocess.CalledProcessError, ValueError, FileNotFoundError):
        return 0


def generate_thumbnail(video_path, output_path):
    """Extrae un fotograma del vídeo como miniatura usando ffmpeg."""
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(video_path),
                "-vf",
                "thumbnail",
                "-frames:v",
                "1",
                str(output_path),
            ],
            capture_output=True,
            check=True,
        )
        return output_path
    except subprocess.CalledProcessError:
        return None


def is_season(directory):
    """Detecta si el directorio representa una temporada por su nombre."""
    return bool(re.match(r"^t\d+", Path(directory).name.lower()))

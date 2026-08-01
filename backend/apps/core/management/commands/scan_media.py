"""Escaneo de la carpeta media para poblar el catálogo.

Convención de carpetas:

    media/movies/<slug>/                    → película individual
        video.mp4 + thumbnail.jpg
    media/movies/<slug-saga>/movies/...     → saga de películas
        thumbnail.jpg + movies/<pelicula>/video.mp4
    media/series/<slug>/<temporada>/...     → serie con temporadas
        thumbnail.jpg + season-1/episode-1.mp4
"""

# Identifica el año como marcador de temporada en el nombre de carpeta.
import re

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Episode, Movie, Saga, Season, Series
from apps.core.utils.media_scanner import (
    duration_ffprobe,
    generate_thumbnail,
    image_in,
    name_to_slug,
    slug_to_title,
    videos_in,
)


def relative_path(media_root, path):
    """Devuelve la ruta del archivo relativa a la raíz media."""
    return path.relative_to(media_root).as_posix()


def season_number(name):
    """Extrae el número de temporada de un nombre de carpeta."""
    base = name.lower()
    match = re.match(r"t(\d+)", base)
    if match:
        return int(match.group(1))
    match = re.search(r"(\d+)", base)
    return int(match.group(1)) if match else 1


def episode_number(name):
    """Extrae el número de episodio del nombre del archivo."""
    base = name.stem
    match = re.search(r"(?:e|ep)\s*[-_ ]?(\d+)", base, re.I)
    if match:
        return int(match.group(1))
    match = re.search(r"(\d+)", base)
    return int(match.group(1)) if match else 0


class Command(BaseCommand):
    help = "Escanea la carpeta media y actualiza el catálogo de forma idempotente."

    def add_arguments(self, parser):
        parser.add_argument(
            "--generate-thumbnails",
            action="store_true",
            help="Genera la miniatura desde el vídeo con ffmpeg si no existe imagen.",
        )

    def handle(self, *args, **options):
        from django.conf import settings

        media_root = settings.MEDIA_ROOT
        self.generate_thumbnails = options["generate_thumbnails"]

        if not media_root.exists():
            self.stderr.write(f"No existe la carpeta media: {media_root}")
            return

        summary = {"movies": 0, "sagas": 0, "series": 0, "seasons": 0, "episodes": 0}

        with transaction.atomic():
            self._scan_movies(media_root, summary)
            self._scan_series(media_root, summary)

        self.stdout.write(self.style.SUCCESS("Escaneo completado: " + str(summary)))

    def _scan_movies(self, media_root, summary):
        movies_dir = media_root / "movies"
        active_paths = set()

        if not movies_dir.is_dir():
            return

        for folder in sorted(movies_dir.iterdir()):
            if not folder.is_dir():
                continue
            subdir_movies = folder / "movies"

            if subdir_movies.is_dir():
                # La carpeta es una saga.
                saga, _ = Saga.objects.update_or_create(
                    slug=name_to_slug(folder.name),
                    defaults={"title": slug_to_title(folder.name)},
                )
                summary["sagas"] += 1

                for index, movie_dir in enumerate(sorted(subdir_movies.iterdir())):
                    if not movie_dir.is_dir():
                        continue
                    summary["movies"] += 1
                    active_paths |= self._create_movie(
                        media_root, movie_dir, saga=saga, order=index + 1
                    )
            else:
                # La carpeta es una película individual.
                summary["movies"] += 1
                active_paths |= self._create_movie(media_root, folder)

        # Elimina registros obsoletos (sin coincidencia en disco).
        Movie.objects.exclude(video__in=active_paths).delete()

    def _create_movie(self, media_root, folder, saga=None, order=0):
        """Crea o actualiza una película y devuelve su ruta de vídeo activa."""
        video = videos_in(folder)
        if not video:
            return set()
        video_path = video[0]
        image = image_in(folder)
        if image is None and self.generate_thumbnails:
            image = generate_thumbnail(video_path, folder / "thumbnail.jpg")
        thumbnail_path = relative_path(media_root, image) if image else ""

        video_relative = relative_path(media_root, video_path)
        Movie.objects.update_or_create(
            video=video_relative,
            defaults={
                "title": slug_to_title(folder.name),
                "thumbnail": thumbnail_path,
                "duration_sec": duration_ffprobe(video_path),
                "saga": saga,
                "order_in_saga": order,
            },
        )
        return {video_relative}

    def _scan_series(self, media_root, summary):
        series_dir = media_root / "series"
        active_paths = set()

        if not series_dir.is_dir():
            return

        for series_folder in sorted(series_dir.iterdir()):
            if not series_folder.is_dir():
                continue
            summary["series"] += 1

            series_image = image_in(series_folder)
            series, _ = Series.objects.update_or_create(
                slug=name_to_slug(series_folder.name),
                defaults={
                    "title": slug_to_title(series_folder.name),
                    "thumbnail": (
                        relative_path(media_root, series_image) if series_image else ""
                    ),
                },
            )

            season_dirs = [
                d for d in series_folder.iterdir() if d.is_dir() and videos_in(d)
            ]
            if not season_dirs and videos_in(series_folder):
                season_dirs = [series_folder]

            for season_folder in sorted(season_dirs):
                season, _ = Season.objects.get_or_create(
                    series=series,
                    number=season_number(season_folder.name),
                )
                summary["seasons"] += 1

                for video_path in videos_in(season_folder):
                    video_relative = relative_path(media_root, video_path)
                    active_paths.add(video_relative)
                    image = image_in(season_folder) or series_image
                    Episode.objects.update_or_create(
                        season=season,
                        number=episode_number(video_path),
                        defaults={
                            "title": slug_to_title(video_path.stem),
                            "video": video_relative,
                            "thumbnail": (
                                relative_path(media_root, image) if image else ""
                            ),
                            "duration_sec": duration_ffprobe(video_path),
                        },
                    )
                    summary["episodes"] += 1

        Episode.objects.exclude(video__in=active_paths).delete()
        Season.objects.filter(episodes=None).delete()
        Series.objects.filter(seasons=None).delete()

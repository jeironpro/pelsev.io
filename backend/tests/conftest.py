"""Configuración compartida de los tests de pelsev.io."""

import pytest
from django.core.management import call_command
from rest_framework.test import APIClient

from apps.core.management.commands import scan_media as scan_media_module

# Estructura de ejemplo de la carpeta media para los tests.
MEDIA_TREE = {
    "movies/el-padrino": ["video.mp4", "thumbnail.jpg"],
    "movies/star-wars/movies/una-nueva-esperanza": ["video.mp4", "thumbnail.jpg"],
    "movies/star-wars/movies/el-imperio-contraataca": ["video.mp4", "thumbnail.jpg"],
    "series/breaking-bad/season-1": ["episode-1.mp4", "episode-2.mp4"],
    "series/breaking-bad/season-2": ["episode-1.mp4"],
}


@pytest.fixture(autouse=True)
def allow_testserver(settings):
    """Permite el host testserver usado por el cliente de pruebas."""
    settings.ALLOWED_HOSTS = ["testserver", "localhost", "127.0.0.1"]
    settings.PASSWORD_HASHERS = [
        "django.contrib.auth.hashers.MD5PasswordHasher",
    ]


@pytest.fixture
def media_root(tmp_path, settings, monkeypatch):
    """Crea una carpeta media temporal y la activa en los ajustes."""
    for folder, files in MEDIA_TREE.items():
        dir_path = tmp_path / folder
        dir_path.mkdir(parents=True, exist_ok=True)
        for file in files:
            content = b"0123456789" * 200 if file.endswith(".mp4") else b"image-data"
            (dir_path / file).write_bytes(content)

    settings.MEDIA_ROOT = tmp_path
    monkeypatch.setattr(scan_media_module, "duration_ffprobe", lambda _: 120)
    return tmp_path


@pytest.fixture
def populated(media_root):
    """Ejecuta el escaneo sobre la carpeta media temporal."""
    call_command("scan_media")
    return media_root


@pytest.fixture
def populated_thumbnails(media_root, monkeypatch):
    """Ejecuta el escaneo con miniaturas simuladas para series y temporadas."""
    generated = []

    def fake_generate_thumbnail(video_path, output_path):
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(b"thumb-data")
        generated.append(str(output_path))
        return output_path

    monkeypatch.setattr(
        scan_media_module, "generate_thumbnail", fake_generate_thumbnail
    )
    call_command("scan_media", generate_thumbnails=True)
    return media_root, generated


@pytest.fixture
def client():
    """Cliente de pruebas de la API."""
    return APIClient()

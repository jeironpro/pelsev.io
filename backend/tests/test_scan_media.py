"""Tests del comando de escaneo de la carpeta media."""

import pytest
from django.core.management import call_command

from apps.catalog.models import Episode, Movie, Saga, Season, Series


@pytest.mark.django_db
def test_escaneo_puebla_el_catalogo(populated):
    """El escaneo crea películas, saga, serie, temporadas y episodios."""
    assert Movie.objects.count() == 3
    assert Saga.objects.count() == 1
    assert Series.objects.count() == 1
    assert Season.objects.count() == 2
    assert Episode.objects.count() == 3


@pytest.mark.django_db
def test_escaneo_detecta_saga(populated):
    """Las películas de una subcarpeta movies se asocian a una saga."""
    saga = Saga.objects.get(slug="star-wars")
    assert saga.title == "Star Wars"
    assert saga.movies.count() == 2


@pytest.mark.django_db
def test_escaneo_lee_duracion(populated):
    """La duración de los vídeos se rellena con ffprobe (simulado)."""
    movie = Movie.objects.get(title="El Padrino")
    assert movie.duration_sec == 120


@pytest.mark.django_db
def test_escaneo_es_idempotente(populated, media_root):
    """Ejecutar el escaneo dos veces no duplica registros."""
    call_command("scan_media")
    assert Movie.objects.count() == 3
    assert Episode.objects.count() == 3
    assert Season.objects.count() == 2


@pytest.mark.django_db
def test_escaneo_elimina_obsoletos(media_root, populated):
    """Los registros sin archivo en disco se eliminan al reescanear."""
    obsolete = Movie.objects.get(title="El Padrino")
    import shutil

    shutil.rmtree(media_root / "movies" / "el-padrino")
    call_command("scan_media")
    assert not Movie.objects.filter(pk=obsolete.pk).exists()

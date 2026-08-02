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


@pytest.mark.django_db
def test_escaneo_elimina_sagas_sin_peliculas(media_root, populated):
    """Una saga sin películas en disco se elimina al reescanear."""
    import shutil

    shutil.rmtree(media_root / "movies" / "star-wars")
    call_command("scan_media")
    assert not Saga.objects.filter(slug="star-wars").exists()


@pytest.mark.django_db
def test_escaneo_asigna_categoria_de_la_carpeta(populated):
    """La categoría se toma de la carpeta que agrupa a la serie."""
    series = Series.objects.get(slug="breaking-bad")
    assert series.categories.filter(slug="drama").exists()


@pytest.mark.django_db
def test_escaneo_sin_miniaturas_de_serie(populated):
    """Sin --generate-thumbnails las series y episodios quedan sin imagen."""
    series = Series.objects.get(slug="breaking-bad")
    assert series.thumbnail == ""
    assert all(not e.thumbnail for e in Episode.objects.all())


@pytest.mark.django_db
def test_escaneo_genera_miniaturas_de_series(populated_thumbnails):
    """Con --generate-thumbnails la serie y cada episodio reciben su miniatura."""
    media_root, generated = populated_thumbnails
    series = Series.objects.get(slug="breaking-bad")
    assert series.thumbnail == "series/drama/breaking-bad/thumbnail.jpg"
    assert str(media_root / "series/drama/breaking-bad/thumbnail.jpg") in generated

    # Cada episodio tiene su propia miniatura (no compartida).
    episodio = Episode.objects.get(season__series=series, season__number=1, number=1)
    assert episodio.thumbnail == "series/drama/breaking-bad/season-1/episode-1.jpg"
    assert (
        str(media_root / "series/drama/breaking-bad/season-1/episode-1.jpg")
        in generated
    )

    # Las miniaturas de episodios distintos son diferentes.
    ep2 = Episode.objects.get(season__series=series, season__number=1, number=2)
    assert ep2.thumbnail != episodio.thumbnail
    assert ep2.thumbnail == "series/drama/breaking-bad/season-1/episode-2.jpg"

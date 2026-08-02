"""Tests de entrega de vídeo y miniaturas."""

import pytest

from apps.catalog.models import Movie, Series


@pytest.mark.django_db
def test_video_completo(client, populated, media_root):
    """Una petición sin rango devuelve el vídeo completo."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.get(f"/api/media/movie/{movie.pk}/video/")
    assert response.status_code == 200
    assert response["Content-Type"] == "video/mp4"
    assert response["Accept-Ranges"] == "bytes"


@pytest.mark.django_db
def test_video_con_rango(client, populated):
    """Una petición con Range devuelve 206 y el trozo pedido."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.get(
        f"/api/media/movie/{movie.pk}/video/",
        HTTP_RANGE="bytes=10-19",
    )
    assert response.status_code == 206
    assert response["Content-Range"].startswith("bytes 10-19/")
    assert response["Content-Length"] == "10"


@pytest.mark.django_db
def test_rango_fuera_de_rango(client, populated):
    """Un rango más allá del final devuelve 416."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.get(
        f"/api/media/movie/{movie.pk}/video/",
        HTTP_RANGE="bytes=999999-",
    )
    assert response.status_code == 416


@pytest.mark.django_db
def test_miniatura(client, populated):
    """La miniatura de una película se sirve correctamente."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.get(f"/api/media/movie/{movie.pk}/thumbnail/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_serie_sin_video_devuelve_404(client, populated):
    """Una serie no tiene vídeo directo; devuelve 404."""
    series = Series.objects.first()
    response = client.get(f"/api/media/series/{series.pk}/video/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_contenido_inexistente_devuelve_404(client, populated):
    """Un contenido que no existe devuelve 404."""
    response = client.get("/api/media/movie/99999/video/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_archivo_inexistente_devuelve_404(client, media_root, populated):
    """Si el archivo no está en disco, devuelve 404."""
    movie = Movie.objects.first()
    movie.video = "movies/no-existe/video.mp4"
    movie.save()
    response = client.get(f"/api/media/movie/{movie.pk}/video/")
    assert response.status_code == 404

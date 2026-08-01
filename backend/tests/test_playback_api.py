"""Tests de la API de reproducción (progreso y "Continuar viendo")."""

import pytest

from apps.catalog.models import Episode, Movie
from apps.playback.models import Progress


@pytest.mark.django_db
def test_guardar_progreso_pelicula(client, populated):
    """Se crea el progreso de una película."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.post(
        "/api/playback/progress/",
        {
            "type": "movie",
            "content_id": movie.pk,
            "position_sec": 40,
            "duration_sec": 120,
            "completed": False,
        },
        format="json",
    )
    assert response.status_code == 201
    assert Progress.objects.get(movie=movie).position_sec == 40


@pytest.mark.django_db
def test_guardar_progreso_actualiza_mismo_contenido(client, populated):
    """Guardar dos veces el mismo contenido actualiza la posición."""
    movie = Movie.objects.get(title="El Padrino")
    payload = {
        "type": "movie",
        "content_id": movie.pk,
        "duration_sec": 120,
        "completed": False,
    }
    client.post(
        "/api/playback/progress/", {**payload, "position_sec": 40}, format="json"
    )
    client.post(
        "/api/playback/progress/", {**payload, "position_sec": 60}, format="json"
    )
    assert Progress.objects.filter(movie=movie).count() == 1
    assert Progress.objects.get(movie=movie).position_sec == 60


@pytest.mark.django_db
def test_tipo_invalido(client, populated):
    """Un tipo de contenido no válido devuelve un error 400."""
    response = client.post(
        "/api/playback/progress/",
        {"type": "libro", "content_id": 1, "position_sec": 10, "duration_sec": 100},
        format="json",
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_continuar_viendo(client, populated):
    """Solo aparecen elementos en curso, ordenados por última visualización."""
    movie = Movie.objects.get(title="El Padrino")
    episode = Episode.objects.first()
    client.post(
        "/api/playback/progress/",
        {
            "type": "movie",
            "content_id": movie.pk,
            "position_sec": 40,
            "duration_sec": 120,
        },
        format="json",
    )
    client.post(
        "/api/playback/progress/",
        {
            "type": "episode",
            "content_id": episode.pk,
            "position_sec": 30,
            "duration_sec": 120,
        },
        format="json",
    )
    response = client.get("/api/playback/progress/continue-watching/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # El episodio se vio después, así que aparece primero.
    assert data[0]["type"] == "episode"
    assert data[0]["remaining_sec"] == 90
    assert data[0]["series_id"] is not None


@pytest.mark.django_db
def test_quitar_de_continuar_viendo(client, populated):
    """Borrar el progreso lo elimina de "Continuar viendo"."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.post(
        "/api/playback/progress/",
        {
            "type": "movie",
            "content_id": movie.pk,
            "position_sec": 40,
            "duration_sec": 120,
        },
        format="json",
    )
    progress_id = response.json()["id"]
    assert client.get("/api/playback/progress/continue-watching/").json()

    response = client.delete(f"/api/playback/progress/{progress_id}/")
    assert response.status_code == 204
    assert not client.get("/api/playback/progress/continue-watching/").json()


@pytest.mark.django_db
def test_contenido_completado_no_aparece(client, populated):
    """Un contenido terminado no se muestra en "Continuar viendo"."""
    movie = Movie.objects.get(title="El Padrino")
    client.post(
        "/api/playback/progress/",
        {
            "type": "movie",
            "content_id": movie.pk,
            "position_sec": 120,
            "duration_sec": 120,
            "completed": True,
        },
        format="json",
    )
    response = client.get("/api/playback/progress/continue-watching/")
    assert response.json() == []

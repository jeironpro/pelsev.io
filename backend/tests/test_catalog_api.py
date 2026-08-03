"""Tests de la API del catálogo."""

import pytest

from apps.catalog.models import Movie, Series


@pytest.mark.django_db
def test_listado_peliculas(client, populated):
    """El listado devuelve todas las películas con URLs de media."""
    response = client.get("/api/catalog/movies/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    for movie in data:
        assert movie["thumbnail"].endswith(f"/api/media/movie/{movie['id']}/thumbnail/")
        assert movie["video"].endswith(f"/api/media/movie/{movie['id']}/video/")


@pytest.mark.django_db
def test_detalle_pelicula(client, populated):
    """El detalle devuelve la saga asociada si existe."""
    movie = Movie.objects.get(title="El Padrino")
    response = client.get(f"/api/catalog/movies/{movie.pk}/")
    assert response.status_code == 200
    assert response.json()["saga"] is None


@pytest.mark.django_db
def test_listado_series(client, populated):
    """El listado de series funciona e incluye el número de episodios."""
    response = client.get("/api/catalog/series/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["episodes_count"] == 3


@pytest.mark.django_db
def test_detalle_serie_con_temporadas(client, populated):
    """El detalle de la serie incluye temporadas y episodios con progreso."""
    series = Series.objects.get()
    response = client.get(f"/api/catalog/series/{series.pk}/")
    assert response.status_code == 200
    data = response.json()
    assert len(data["seasons"]) == 2
    first_season = data["seasons"][0]
    assert first_season["number"] == 1
    assert len(first_season["episodes"]) == 2
    assert first_season["episodes"][0]["progress"] is None


@pytest.mark.django_db
def test_filtro_por_categoria(client, populated):
    """El filtro por categoría devuelve solo el contenido asociado."""
    from apps.catalog.models import Category

    category = Category.objects.create(slug="western", name="Western")
    movie = Movie.objects.first()
    movie.categories.add(category)
    response = client.get(f"/api/catalog/movies/?category={category.slug}")
    assert response.status_code == 200
    assert all(item["id"] == movie.pk for item in response.json())


@pytest.mark.django_db
def test_home(client, populated):
    """El endpoint home devuelve categorías y sagas."""
    response = client.get("/api/catalog/home/")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    assert "sagas" in data
    assert len(data["sagas"]) == 1
    assert data["sagas"][0]["title"] == "Star Wars"

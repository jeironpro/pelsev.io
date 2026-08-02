"""Tests de las categorías por defecto creadas por migración."""

import pytest

from apps.catalog.models import Category


@pytest.mark.django_db
def test_categorias_por_defecto_existen():
    """La migración crea categorías aunque no tengan contenido."""
    slugs = {c.slug for c in Category.objects.all()}
    assert "accion" in slugs
    assert "anime" in slugs
    assert "ciencia-ficcion" in slugs
    assert "terror" in slugs


@pytest.mark.django_db
def test_categorias_sin_contenido_se_listan(client):
    """El endpoint home devuelve también las categorías vacías."""
    response = client.get("/api/catalog/home/")
    assert response.status_code == 200
    categorias = response.json()["categories"]
    assert len(categorias) >= 10
    assert any(
        c["slug"] == "terror" and not c["movies"] and not c["series"]
        for c in categorias
    )

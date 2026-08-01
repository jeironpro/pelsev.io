"""Configuración del esquema Swagger/OpenAPI (drf-spectacular)."""

from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

schema_urlpatterns = [
    # Esquema OpenAPI y documentación interactiva.
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
]

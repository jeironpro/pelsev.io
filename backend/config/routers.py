"""Rutas de la API de pelsev.io."""

from django.urls import include, path
from rest_framework import routers

from apps.catalog import views as catalog_views
from apps.core import views as media_views
from apps.playback import views as playback_views

# Router con los recursos del catálogo y reproducción.
router = routers.DefaultRouter()
router.register(r"catalog/movies", catalog_views.MovieViewSet, basename="movie")
router.register(r"catalog/series", catalog_views.SeriesViewSet, basename="series")
router.register(
    r"catalog/categories", catalog_views.CategoryViewSet, basename="category"
)
router.register(r"catalog/home", catalog_views.HomeViewSet, basename="home")
router.register(
    r"playback/progress", playback_views.ProgressViewSet, basename="progress"
)

# Rutas manuales de entrega de archivos media.
media_urlpatterns = [
    path(
        "media/<str:content_type>/<int:pk>/video/",
        media_views.video,
        name="media-video",
    ),
    path(
        "media/<str:content_type>/<int:pk>/thumbnail/",
        media_views.thumbnail,
        name="media-thumbnail",
    ),
]

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/", include(media_urlpatterns)),
]

"""Vistas del catálogo de pelsev.io."""

from django.db.models import Prefetch
from rest_framework import viewsets
from rest_framework.response import Response

from apps.catalog.models import Category, Movie, Saga, Series
from apps.catalog.serializers import (
    CategorySerializer,
    MovieSerializer,
    SagaSerializer,
    SeriesDetailSerializer,
    SeriesListSerializer,
)


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado y detalle de películas."""

    queryset = Movie.objects.select_related("saga").prefetch_related("categories")
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(categories__slug=category)
        return queryset


class SeriesViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado y detalle de series."""

    queryset = Series.objects.prefetch_related(
        Prefetch("seasons__episodes", to_attr="episodes_ordered")
    ).prefetch_related("categories")
    serializer_class = SeriesListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(categories__slug=category)
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return SeriesDetailSerializer
        return SeriesListSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado de categorías."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class HomeViewSet(viewsets.ViewSet):
    """Datos de la página de inicio: categorías con contenido y sagas."""

    def list(self, request):
        categories = []
        for category in Category.objects.prefetch_related("movies", "series"):
            categories.append(
                {
                    "slug": category.slug,
                    "name": category.name,
                    "movies": [
                        MovieSerializer(m, context={"request": request}).data
                        for m in category.movies.all()
                    ],
                    "series": [
                        SeriesListSerializer(s, context={"request": request}).data
                        for s in category.series.all()
                    ],
                }
            )
        sagas = [
            SagaSerializer(s, context={"request": request}).data
            for s in Saga.objects.prefetch_related("movies")
        ]
        return Response({"categories": categories, "sagas": sagas})

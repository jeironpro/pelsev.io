"""Modelos del catálogo de pelsev.io.

Contienen categorías, sagas, películas, series, temporadas y episodios.
"""

from django.db import models


class Category(models.Model):
    """Categoría o género asociada a películas y series."""

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "categoría"
        verbose_name_plural = "categorías"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Saga(models.Model):
    """Colección de películas (por ejemplo, una saga cinematográfica)."""

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "saga"
        verbose_name_plural = "sagas"
        ordering = ["title"]

    def __str__(self):
        return self.title


class Movie(models.Model):
    """Película individual o perteneciente a una saga."""

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video = models.CharField(max_length=500)
    thumbnail = models.CharField(max_length=500)
    duration_sec = models.PositiveIntegerField(default=0)
    saga = models.ForeignKey(
        Saga,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="movies",
    )
    order_in_saga = models.PositiveIntegerField(default=0)
    categories = models.ManyToManyField(Category, related_name="movies", blank=True)

    class Meta:
        verbose_name = "película"
        verbose_name_plural = "películas"
        ordering = ["title"]

    def __str__(self):
        return self.title


class Series(models.Model):
    """Serie compuesta por temporadas."""

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail = models.CharField(max_length=500)
    categories = models.ManyToManyField(Category, related_name="series", blank=True)

    class Meta:
        verbose_name = "serie"
        verbose_name_plural = "series"
        ordering = ["title"]

    def __str__(self):
        return self.title


class Season(models.Model):
    """Temporada de una serie."""

    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name="seasons")
    number = models.PositiveIntegerField()

    class Meta:
        verbose_name = "temporada"
        verbose_name_plural = "temporadas"
        ordering = ["series", "number"]
        unique_together = ("series", "number")

    def __str__(self):
        return f"{self.series.title} - T{self.number}"


class Episode(models.Model):
    """Episodio de una temporada."""

    season = models.ForeignKey(
        Season,
        on_delete=models.CASCADE,
        related_name="episodes",
    )
    number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    video = models.CharField(max_length=500)
    thumbnail = models.CharField(max_length=500, blank=True)
    duration_sec = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "episodio"
        verbose_name_plural = "episodios"
        ordering = ["season", "number"]
        unique_together = ("season", "number")

    def __str__(self):
        series = self.season.series.title
        season_number = self.season.number
        return f"{series} - {season_number}x{self.number} {self.title}"

"""Administración del catálogo en el panel de Django."""

from django.contrib import admin

from apps.catalog.models import Category, Episode, Movie, Saga, Season, Series


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Saga)
class SagaAdmin(admin.ModelAdmin):
    list_display = ("title",)


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title", "saga", "duration_sec")
    list_filter = ("saga", "categories")
    filter_horizontal = ("categories",)


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ("title",)
    filter_horizontal = ("categories",)


class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ("series", "number")
    inlines = [EpisodeInline]


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = ("title", "season", "number", "duration_sec")

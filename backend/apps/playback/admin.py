"""Administración de la reproducción en el panel de Django."""

from django.contrib import admin

from apps.playback.models import Progress


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = (
        "movie",
        "episode",
        "position_sec",
        "duration_sec",
        "completed",
        "updated_at",
    )
    list_filter = ("completed",)

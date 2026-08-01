"""Modelos de reproducción: progreso de visualización y "Continuar viendo"."""

from django.db import models


class Progress(models.Model):
    """Posición de visualización de una película o episodio (usuario único).

    Solo una de las dos claves foráneas puede estar establecida.
    """

    movie = models.ForeignKey(
        "catalog.Movie",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="progress",
    )
    episode = models.ForeignKey(
        "catalog.Episode",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="progress",
    )
    position_sec = models.PositiveIntegerField(default=0)
    duration_sec = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "progreso"
        verbose_name_plural = "progresos"
        ordering = ["-updated_at"]

    def __str__(self):
        if self.movie_id:
            target = f"película {self.movie_id}"
        else:
            target = f"episodio {self.episode_id}"
        return f"Progreso {target}: {self.position_sec}s"

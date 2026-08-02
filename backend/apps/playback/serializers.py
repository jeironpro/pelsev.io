"""Serializers de reproducción: escritura de progreso y "Continuar viendo"."""

from django.urls import reverse
from rest_framework import serializers

from apps.catalog.models import Episode, Movie
from apps.playback.models import Progress

VALID_TYPES = {"movie", "episode"}


class ProgressSerializer(serializers.ModelSerializer):
    """Escritura/lectura del progreso de una película o episodio."""

    type = serializers.CharField(write_only=True)
    content_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Progress
        fields = [
            "id",
            "type",
            "content_id",
            "position_sec",
            "duration_sec",
            "completed",
            "updated_at",
        ]
        read_only_fields = ["id", "updated_at"]

    def validate(self, attrs):
        content_type = attrs.get("type")
        if content_type not in VALID_TYPES:
            raise serializers.ValidationError({"type": "Tipo no válido."})
        content_id = attrs.get("content_id")
        if content_type == "movie":
            if not Movie.objects.filter(pk=content_id).exists():
                raise serializers.ValidationError(
                    {"content_id": "Película no encontrada."}
                )
        else:
            if not Episode.objects.filter(pk=content_id).exists():
                raise serializers.ValidationError(
                    {"content_id": "Episodio no encontrado."}
                )
        return attrs

    def create(self, validated_data):
        content_type = validated_data.pop("type")
        content_id = validated_data.pop("content_id")
        lookup = (
            {"movie_id": content_id}
            if content_type == "movie"
            else {"episode_id": content_id}
        )
        progress, _ = Progress.objects.update_or_create(
            **lookup,
            defaults=validated_data,
        )
        return progress

    def update(self, instance, validated_data):
        validated_data.pop("type", None)
        validated_data.pop("content_id", None)
        return super().update(instance, validated_data)


def media_url(request, content_type, pk, action):
    url = reverse("media-" + action, kwargs={"content_type": content_type, "pk": pk})
    return request.build_absolute_uri(url)


class ContinueWatchingSerializer(serializers.ModelSerializer):
    """Representación de un elemento en "Continuar viendo"."""

    type = serializers.SerializerMethodField()
    content_id = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    remaining_sec = serializers.SerializerMethodField()
    series_id = serializers.SerializerMethodField()
    season_number = serializers.SerializerMethodField()
    episode_number = serializers.SerializerMethodField()

    class Meta:
        model = Progress
        fields = [
            "id",
            "type",
            "content_id",
            "title",
            "thumbnail",
            "duration_sec",
            "position_sec",
            "remaining_sec",
            "completed",
            "video",
            "series_id",
            "season_number",
            "episode_number",
        ]

    def _request(self):
        return self.context.get("request")

    def get_type(self, obj):
        return "movie" if obj.movie_id else "episode"

    def get_content_id(self, obj):
        return obj.movie_id or obj.episode_id

    def get_title(self, obj):
        if obj.movie_id:
            return obj.movie.title
        episode = obj.episode
        series = episode.season.series
        return (
            f"{series.title} · {episode.season.number}x{episode.number} {episode.title}"
        )

    def get_thumbnail(self, obj):
        if obj.movie_id:
            return media_url(self._request(), "movie", obj.movie_id, "thumbnail")
        return media_url(self._request(), "episode", obj.episode_id, "thumbnail")

    def get_video(self, obj):
        if obj.movie_id:
            return media_url(self._request(), "movie", obj.movie_id, "video")
        return media_url(self._request(), "episode", obj.episode_id, "video")

    def get_remaining_sec(self, obj):
        return max(0, obj.duration_sec - obj.position_sec)

    def get_series_id(self, obj):
        return obj.episode.season.series_id if obj.episode_id else None

    def get_season_number(self, obj):
        return obj.episode.season.number if obj.episode_id else None

    def get_episode_number(self, obj):
        return obj.episode.number if obj.episode_id else None

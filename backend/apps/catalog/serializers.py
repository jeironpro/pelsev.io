"""Serializers del catálogo de pelsev.io."""

from django.urls import reverse
from rest_framework import serializers

from apps.catalog.models import Category, Episode, Movie, Saga, Season, Series
from apps.playback.models import Progress


def media_url(request, tipo, pk, accion):
    """Construye la URL absoluta de un vídeo o miniatura."""
    ruta = reverse(
        "media-" + accion,
        kwargs={"tipo": tipo, "pk": pk},
    )
    return request.build_absolute_uri(ruta)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["slug", "name"]


class SagaSerializer(serializers.ModelSerializer):
    movies = serializers.SerializerMethodField()

    class Meta:
        model = Saga
        fields = ["id", "title", "description", "movies"]

    def get_movies(self, obj):
        request = self.context.get("request")
        return [
            {
                "id": m.id,
                "title": m.title,
                "duration_sec": m.duration_sec,
                "thumbnail": media_url(request, "movie", m.id, "thumbnail"),
                "video": media_url(request, "movie", m.id, "video"),
            }
            for m in obj.movies.order_by("order_in_saga")
        ]


class MovieSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    saga = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "description",
            "duration_sec",
            "thumbnail",
            "video",
            "saga",
            "order_in_saga",
            "categories",
        ]

    def get_thumbnail(self, obj):
        return media_url(self.context.get("request"), "movie", obj.id, "thumbnail")

    def get_video(self, obj):
        return media_url(self.context.get("request"), "movie", obj.id, "video")

    def get_saga(self, obj):
        if obj.saga_id is None:
            return None
        return {"id": obj.saga_id, "title": obj.saga.title}


class EpisodeSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Episode
        fields = [
            "id",
            "number",
            "title",
            "duration_sec",
            "thumbnail",
            "video",
            "progress",
        ]

    def get_thumbnail(self, obj):
        return media_url(self.context.get("request"), "episode", obj.id, "thumbnail")

    def get_video(self, obj):
        return media_url(self.context.get("request"), "episode", obj.id, "video")

    def get_progress(self, obj):
        progress = self.context.get("progress", {}).get(obj.id)
        if not progress:
            return None
        return {
            "position_sec": progress.position_sec,
            "duration_sec": progress.duration_sec,
            "completed": progress.completed,
        }


class SeasonSerializer(serializers.ModelSerializer):
    episodes = serializers.SerializerMethodField()

    class Meta:
        model = Season
        fields = ["id", "number", "episodes"]

    def get_episodes(self, obj):
        request = self.context.get("request")
        progress = self.context.get("progress", {})
        return [
            EpisodeSerializer(
                ep, context={"request": request, "progress": progress}
            ).data
            for ep in obj.episodes.order_by("number")
        ]


class SeriesListSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Series
        fields = ["id", "title", "description", "thumbnail", "categories"]

    def get_thumbnail(self, obj):
        return media_url(self.context.get("request"), "series", obj.id, "thumbnail")


class SeriesDetailSerializer(SeriesListSerializer):
    seasons = serializers.SerializerMethodField()

    class Meta(SeriesListSerializer.Meta):
        fields = SeriesListSerializer.Meta.fields + ["seasons"]

    def get_seasons(self, obj):
        request = self.context.get("request")
        progress = {
            p.episode_id: p
            for p in Progress.objects.filter(episode__season__series=obj)
        }
        return [
            SeasonSerializer(s, context={"request": request, "progress": progress}).data
            for s in obj.seasons.order_by("number")
        ]

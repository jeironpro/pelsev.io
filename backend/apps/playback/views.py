"""Vistas de reproducción: progreso y "Continuar viendo"."""

from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.playback.models import Progress
from apps.playback.serializers import ContinueWatchingSerializer, ProgressSerializer


class ProgressViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Gestión del progreso de reproducción."""

    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

    @action(detail=False, methods=["get"], url_path="continue-watching")
    def continue_watching(self, request):
        """Elementos en curso ordenados por última visualización."""
        progress = (
            Progress.objects.select_related(
                "movie",
                "episode__season__series",
            )
            .filter(completed=False)
            .exclude(position_sec=0)
            .order_by("-updated_at")
        )
        serializer = ContinueWatchingSerializer(
            progress, many=True, context={"request": request}
        )
        return Response(serializer.data)

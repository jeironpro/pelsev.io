"""Utilidades compartidas del backend de pelsev.io."""

from django.urls import reverse


def media_url(request, content_type, pk, action):
    """Construye la URL absoluta de un vídeo o miniatura."""
    url = reverse(
        "media-" + action,
        kwargs={"content_type": content_type, "pk": pk},
    )
    return request.build_absolute_uri(url)

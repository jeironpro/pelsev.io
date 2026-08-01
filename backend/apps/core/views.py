"""Vistas de entrega de archivos media (vídeo y miniaturas)."""

import mimetypes
import re
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, HttpResponseNotFound, StreamingHttpResponse
from rest_framework import status as http_status

from apps.catalog.models import Episode, Movie, Series

CONTENT_TYPES = {
    "movie": Movie,
    "episode": Episode,
    "series": Series,
}

BLOCK_SIZE = 8192


def _range_response(path, request):
    """Sirve un archivo soportando peticiones HTTP Range (seek)."""
    size = path.stat().st_size
    content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"

    range_header = request.headers.get("Range")

    def generate(start, end):
        with path.open("rb") as file:
            file.seek(start)
            remaining = end - start + 1
            while remaining > 0:
                block = file.read(min(BLOCK_SIZE, remaining))
                if not block:
                    break
                remaining -= len(block)
                yield block

    if range_header:
        match = re.match(r"bytes=(\d*)-(\d*)", range_header)
        if match:
            start = int(match.group(1)) if match.group(1) else 0
            end = int(match.group(2)) if match.group(2) else size - 1
            if start >= size:
                response = HttpResponse(
                    status=http_status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE
                )
                response["Content-Range"] = f"bytes */{size}"
                return response
            end = min(end, size - 1)
            response = StreamingHttpResponse(
                generate(start, end),
                status=http_status.HTTP_206_PARTIAL_CONTENT,
                content_type=content_type,
            )
            response["Content-Range"] = f"bytes {start}-{end}/{size}"
            response["Accept-Ranges"] = "bytes"
            response["Content-Length"] = str(end - start + 1)
            return response

    response = StreamingHttpResponse(
        generate(0, size - 1),
        status=http_status.HTTP_200_OK,
        content_type=content_type,
    )
    response["Accept-Ranges"] = "bytes"
    response["Content-Length"] = str(size)
    return response


def video(request, tipo, pk):
    """Devuelve el vídeo de una película o episodio."""
    model = CONTENT_TYPES.get(tipo)
    if model not in (Movie, Episode):
        return HttpResponseNotFound("Tipo no válido para vídeo.")
    try:
        content = model.objects.get(pk=pk)
    except model.DoesNotExist:
        return HttpResponseNotFound("Contenido no encontrado.")
    if not content.video:
        return HttpResponseNotFound("Contenido sin vídeo.")
    path = Path(settings.MEDIA_ROOT) / content.video
    if not path.is_file():
        return HttpResponseNotFound("Archivo no encontrado.")
    return _range_response(path, request)


def thumbnail(request, tipo, pk):
    """Devuelve la miniatura de una película, episodio o serie."""
    model = CONTENT_TYPES.get(tipo)
    if model is None:
        return HttpResponseNotFound("Tipo no válido para miniatura.")
    try:
        content = model.objects.get(pk=pk)
    except model.DoesNotExist:
        return HttpResponseNotFound("Contenido no encontrado.")
    if not content.thumbnail:
        return HttpResponseNotFound("Contenido sin miniatura.")
    path = Path(settings.MEDIA_ROOT) / content.thumbnail
    if not path.is_file():
        return HttpResponseNotFound("Archivo no encontrado.")
    return _range_response(path, request)

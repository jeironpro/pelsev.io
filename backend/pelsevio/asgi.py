"""
Configuración ASGI para el proyecto pelsevio.

Expone el objeto ``application`` a nivel de módulo.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pelsevio.settings")

application = get_asgi_application()

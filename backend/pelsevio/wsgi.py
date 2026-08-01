"""
Configuración WSGI para el proyecto pelsevio.

Expone el objeto ``application`` a nivel de módulo.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pelsevio.settings")

application = get_wsgi_application()

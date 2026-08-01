"""
Rutas raíz del proyecto pelsevio (backend).
"""

from django.contrib import admin
from django.urls import path

from config.routers import urlpatterns as api_urlpatterns
from config.swagger import schema_urlpatterns

urlpatterns = (
    [
        path("admin/", admin.site.urls),
    ]
    + api_urlpatterns
    + schema_urlpatterns
)

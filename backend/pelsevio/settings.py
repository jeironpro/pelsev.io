"""
Configuración del proyecto Django para pelsev.io (backend).

Usa variables de entorno definidas en el archivo .env.
"""

from pathlib import Path

import environ

# Directorio base del proyecto.
BASE_DIR = Path(__file__).resolve().parent.parent

# Carga las variables del archivo .env.
env = environ.Env(
    DEBUG=(bool, True),
    ALLOWED_HOSTS=(list, []),
    SECRET_KEY=(str, "django-insecure-cambiar-en-produccion"),
)

environ.Env.read_env(BASE_DIR / ".env")

# SECURITY WARNING: mantener la clave secreta en secreto en producción.
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: no ejecutar con DEBUG activado en producción.
DEBUG = env("DEBUG")

ALLOWED_HOSTS = env("ALLOWED_HOSTS")

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Terceros
    "rest_framework",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    # Propias
    "apps.core",
    "apps.catalog",
    "apps.playback",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "pelsevio.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "pelsevio.wsgi.application"

ASGI_APPLICATION = env("ASGI_APPLICATION", default="pelsevio.asgi.application")

# Base de datos
DB_PATH = Path(env("DB_PATH", default="db.sqlite3"))
if not DB_PATH.is_absolute():
    DB_PATH = BASE_DIR / DB_PATH
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": DB_PATH,
    }
}

# Validación de contraseñas (no usada en v1, sin autenticación)
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",  # noqa: E501
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",  # noqa: E501
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",  # noqa: E501
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",  # noqa: E501
    },
]

# Internationalization
LANGUAGE_CODE = "es"

TIME_ZONE = "Europe/Madrid"

USE_I18N = True

USE_TZ = True

# Archivos estáticos y media
STATIC_URL = "static/"

# Raíz de la carpeta media con el contenido de películas y series.
MEDIA_ROOT = Path(env("MEDIA_ROOT", default="media"))
if not MEDIA_ROOT.is_absolute():
    MEDIA_ROOT = BASE_DIR / MEDIA_ROOT
MEDIA_ROOT = MEDIA_ROOT.resolve()

# Configuración de Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",  # noqa: E501
    "PAGE_SIZE": None,
}

# Configuración de drf-spectacular (Swagger/OpenAPI)
SPECTACULAR_SETTINGS = {
    "TITLE": "pelsev.io API",
    "DESCRIPTION": "API del catálogo y reproducción de pelsev.io.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# CORS: permitir el dev server de Vite en desarrollo.
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS", default=["http://localhost:5173"])

# Identificador por defecto de clave primaria.
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

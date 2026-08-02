"""Crea las categorías por defecto aunque aún no tengan contenido."""

from django.db import migrations

CATEGORIAS = [
    ("accion", "Acción"),
    ("anime", "Anime"),
    ("aventura", "Aventura"),
    ("ciencia-ficcion", "Ciencia ficción"),
    ("comedia", "Comedia"),
    ("drama", "Drama"),
    ("fantasia", "Fantasía"),
    ("misterio", "Misterio"),
    ("suspenso", "Suspenso"),
    ("terror", "Terror"),
]


def crear_categorias(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    for slug, name in CATEGORIAS:
        Category.objects.get_or_create(slug=slug, defaults={"name": name})


def eliminar_categorias(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Category.objects.filter(slug__in=[slug for slug, _ in CATEGORIAS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(crear_categorias, eliminar_categorias),
    ]

"""Elimina la categoría "Animación" y reasigna su contenido a "Anime"."""

from django.db import migrations


def fusionar_animacion(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    anime = Category.objects.filter(slug="anime").first()
    animacion = Category.objects.filter(slug="animacion").first()
    if not anime or not animacion:
        return
    for serie in animacion.series.all():
        serie.categories.remove(animacion)
        serie.categories.add(anime)
    for pelicula in animacion.movies.all():
        pelicula.categories.remove(animacion)
        pelicula.categories.add(anime)
    animacion.delete()


def recrear_animacion(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    Category.objects.get_or_create(slug="animacion", defaults={"name": "Animación"})


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0002_seed_categories"),
    ]

    operations = [
        migrations.RunPython(fusionar_animacion, recrear_animacion),
    ]

# Generated by Django 5.0.2 on 2024-03-06 12:08

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Config",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255, unique=True)),
                ("value", models.CharField(max_length=255)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("STRING", "String"),
                            ("INTEGER", "Integer"),
                            ("BOOLEAN", "Boolean"),
                        ],
                        default="STRING",
                        max_length=10,
                    ),
                ),
            ],
        ),
    ]

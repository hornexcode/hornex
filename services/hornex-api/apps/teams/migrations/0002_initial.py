# Generated by Django 5.0.2 on 2024-03-06 12:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0002_initial"),
        ("teams", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="invite",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="member",
            name="game_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="accounts.gameid"
            ),
        ),
        migrations.AddField(
            model_name="team",
            name="created_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="team",
            name="members",
            field=models.ManyToManyField(
                related_name="teams", through="teams.Member", to="accounts.gameid"
            ),
        ),
        migrations.AddField(
            model_name="member",
            name="team",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="teams.team"
            ),
        ),
        migrations.AddField(
            model_name="invite",
            name="team",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="teams.team"
            ),
        ),
    ]

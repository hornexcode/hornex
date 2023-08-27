from django.contrib import admin
from tournaments.models import Tournament, Game

admin.site.register(
    Tournament, list_display=["name", "game", "status", "potential_prize_pool"]
)
admin.site.register(Game)

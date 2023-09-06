from django.contrib import admin
from tournaments.models import Tournament

admin.site.register(Tournament, list_display=["name", "game", "status", "prize_pool"])

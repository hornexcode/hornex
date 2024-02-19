from django.contrib import admin

from apps.leagueoflegends.models import (
    LeagueEntry,
    Provider,
    Session,
    Summoner,
    Tournament,
)


# @admin.register(Tournament)
# class TournamentAdmin(admin.ModelAdmin):
# list_display = ["name", "challonge_tournament_id", "phase"]


# admin.site.register([LeagueEntry, Summoner, Session, Provider])

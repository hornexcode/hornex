from django.contrib import admin

from apps.leagueoflegends.models import LeagueEntry, Session, Summoner, Tournament

admin.site.register(Tournament)
admin.site.register([LeagueEntry, Summoner, Session])

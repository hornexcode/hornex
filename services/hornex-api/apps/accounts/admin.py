from django.contrib import admin

from apps.accounts.models import GameID, LeagueOfLegendsSummoner

admin.site.register([LeagueOfLegendsSummoner, GameID])

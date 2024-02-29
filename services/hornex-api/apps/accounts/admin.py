from django.contrib import admin

from apps.accounts.models import GameID, LeagueOfLegendsSummoner

admin.site.register([LeagueOfLegendsSummoner])


@admin.register(GameID)
class GameIDAdmin(admin.ModelAdmin):
    list_display = ("user", "game", "nickname", "is_active")

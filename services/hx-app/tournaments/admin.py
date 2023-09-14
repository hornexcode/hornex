from django.contrib import admin, messages
from tournaments.models import Tournament, TournamentRegistration, TournamentTeam
from tournaments.services import TournamentService

admin.site.register(Tournament, list_display=["name", "game", "status", "prize_pool"])


class TournamentRegistrationAdmin(admin.ModelAdmin):
    actions = ["accept_team_registration"]

    @admin.action(description="Accept registration", permissions=["change"])
    def accept_team_registration(modeladmin, request, queryset):
        tournamentService = TournamentService()

        for tournament_registration in queryset:
            try:
                tournamentService.confirm_registration(tournament_registration)
            except Exception as e:
                return messages.error(request, str(e))


admin.site.register(TournamentRegistration, TournamentRegistrationAdmin)
admin.site.register(TournamentTeam)

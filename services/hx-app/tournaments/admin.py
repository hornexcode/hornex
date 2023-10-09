from django.contrib import admin, messages
from tournaments.models import (
    Registration,
    TournamentTeam,
    Tournament,
    Bracket,
)
from tournaments.services import TournamentManagementService
from django.utils.translation import ngettext
from tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
    Tier,
)


admin.site.register([TournamentTeam, Bracket])
admin.site.register(
    [LeagueOfLegendsTournamentProvider, LeagueOfLegendsTournament, Tier]
)


class RegistrationAdmin(admin.ModelAdmin):
    actions = ["accept_team_registration"]

    @admin.action(description="Accept registration", permissions=["change"])
    def accept_team_registration(modeladmin, request, queryset):
        svc = TournamentManagementService()
        print("ENTERED THE ACCEPT")

        success_count = 0
        for tournament_registration in queryset:
            try:
                svc.confirm_registration(tournament_registration)
                success_count += 1
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            ngettext(
                "%d registration was confirmed successfully.",
                "%d registrations were confirmed successfully",
                success_count,
            ),
        )


admin.site.register(Registration, RegistrationAdmin)


class TournamentAdmin(admin.ModelAdmin):
    actions = ["generate_brackets"]
    list_display = ["name", "game", "status", "prize_pool"]

    @admin.action(description="Generate brackets", permissions=["change"])
    def generate_brackets(modeladmin, request, queryset):
        svc = TournamentManagementService()

        success_count = 0
        for tournament in queryset:
            try:
                svc.generate_brackets(tournament)
                success_count += 1
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            ngettext(
                "%d tournament had its brackets created successfully!",
                "%d tournaments had its brackets created successfully",
                success_count,
            ),
        )


admin.site.register(Tournament, TournamentAdmin)

from django.contrib import admin, messages
from tournaments.models import (
    TournamentRegistration,
    TournamentTeam,
    Bracket,
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
)
from tournaments.services import TournamentManagementService
from django.utils.translation import ngettext


admin.site.register([TournamentTeam, LeagueOfLegendsTournamentProvider, Bracket])


class TournamentRegistrationAdmin(admin.ModelAdmin):
    actions = ["accept_team_registration"]

    @admin.action(description="Accept registration", permissions=["change"])
    def accept_team_registration(modeladmin, request, queryset):
        svc = TournamentManagementService()

        for tournament_registration in queryset:
            try:
                svc.confirm_registration(tournament_registration)
            except Exception as e:
                return messages.error(request, str(e))

        messages.success(
            request,
            ngettext(
                "%d registration was confirmed successfully.",
                "%d registrations were confirmed successfully",
                queryset.count(),
            ),
        )


admin.site.register(TournamentRegistration, TournamentRegistrationAdmin)


class TournamentAdmin(admin.ModelAdmin):
    actions = ["generate_brackets"]
    list_display = ["name", "game", "status", "prize_pool"]

    @admin.action(description="Generate brackets", permissions=["change"])
    def generate_brackets(modeladmin, request, queryset):
        svc = TournamentManagementService()

        for tournament in queryset:
            try:
                svc.generate_brackets(tournament)
                messages.success(request, "Brackets created successfully!")
            except Exception as e:
                return messages.error(request, str(e))


admin.site.register(LeagueOfLegendsTournament, TournamentAdmin)

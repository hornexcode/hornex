from django.contrib import admin, messages
from apps.tournaments.models import (
    Registration,
    Subscription,
    Match,
)
from django.utils.translation import ngettext
from apps.tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
    Tier,
)


admin.site.register([LeagueOfLegendsTournamentProvider, Tier, Subscription, Match])


class RegistrationAdmin(admin.ModelAdmin):
    actions = ["accept_team_registration"]

    @admin.action(description="Accept registration", permissions=["change"])
    def accept_team_registration(modeladmin, request, queryset):
        success_count = 0

        for registration in queryset:
            try:
                registration.accept()
                success_count += 1
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            ngettext(
                "%s registration was confirmed successfully.",
                "%s registrations were confirmed successfully",
                success_count,
            ),
        )


admin.site.register(Registration, RegistrationAdmin)


class TournamentAdmin(admin.ModelAdmin):
    actions = ["generate_brackets"]
    list_display = ["name", "game", "status", "prize_pool"]

    @admin.action(description="Generate brackets", permissions=["change"])
    def generate_brackets(modeladmin, request, queryset):
        pass


# admin.site.register(Tournament, TournamentAdmin)


class LeagueOfLegendsTournamentAdmin(admin.ModelAdmin):
    actions = ["start_tournament"]

    @admin.action(
        description="Start selected league of legends tournament",
        permissions=["change"],
    )
    def start_tournament(self, request, queryset):
        print("AQUI Start")
        success_count = 0

        for tournament in queryset:
            try:
                print(tournament)
                success_count += 1
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            f"{success_count} tournament was(were) started successfully.",
        )


admin.site.register(LeagueOfLegendsTournament, LeagueOfLegendsTournamentAdmin)

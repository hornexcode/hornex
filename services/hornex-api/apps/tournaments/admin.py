from django.contrib import admin, messages
from django.db import transaction
from apps.tournaments.models import Registration, Subscription, Match, Round
from django.utils.translation import ngettext

from apps.tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
    Tier,
    Code,
)
from apps.tournaments.leagueoflegends.tasks import on_brackets_generated


admin.site.register(
    [LeagueOfLegendsTournamentProvider, Tier, Subscription, Match, Round, Code]
)


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
    @transaction.atomic
    def start_tournament(self, request, queryset):
        success_count = 0

        for tournament in queryset:
            try:
                tournament.start()
                success_count += 1
                on_brackets_generated.delay(str(tournament.id))
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            ngettext(
                "%(success_count)d tournament was started successfully.",
                "%(success_count)d tournament were started successfully.",
                success_count,
            )
            % {"success_count": success_count},
        )


admin.site.register(LeagueOfLegendsTournament, LeagueOfLegendsTournamentAdmin)

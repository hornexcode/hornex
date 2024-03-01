from django.contrib import admin, messages
from django.utils.translation import ngettext

from apps.tournaments.models import (
    Checkin,
    LeagueOfLegendsLeague,
    LeagueOfLegendsProvider,
    LeagueOfLegendsTournament,
    Match,
    Participant,
    Prize,
    Registration,
)

admin.site.register([LeagueOfLegendsLeague, LeagueOfLegendsTournament, Prize, Checkin])


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ["id", "status", "round", "tournament"]
    search_fields = ["team_a__name", "team_b__name"]


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
admin.site.register(Participant)
admin.site.register(LeagueOfLegendsProvider)

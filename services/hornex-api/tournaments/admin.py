from django.contrib import admin, messages
from tournaments.models import (
    Registration,
    Subscription,
    Bracket,
)
from django.utils.translation import ngettext
from tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
    Tier,
)


admin.site.register([Subscription, Bracket])
admin.site.register(
    [LeagueOfLegendsTournamentProvider, LeagueOfLegendsTournament, Tier]
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

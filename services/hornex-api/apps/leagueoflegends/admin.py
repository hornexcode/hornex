from django.contrib import admin, messages
from django.db import transaction
from django.utils.translation import ngettext

from apps.leagueoflegends.models import LeagueEntry, Session, Summoner, Tournament
from apps.leagueoflegends.tasks import on_brackets_generated


class TournamentAdmin(admin.ModelAdmin):
    actions = ["generate_brackets"]
    list_display = ["name", "game", "phase", "created_at", "updated_at"]

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

    @admin.action(description="Generate brackets", permissions=["change"])
    def generate_brackets(modeladmin, request, queryset):
        pass


admin.site.register(Tournament, TournamentAdmin)
admin.site.register([LeagueEntry, Summoner, Session])

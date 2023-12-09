from django.contrib import admin, messages
from apps.teams.models import Team, Invite, Membership
from django.utils.translation import ngettext


class InviteAdmin(admin.ModelAdmin):
    actions = ["accept_member_invite"]

    @admin.action(description="Accept invites", permissions=["change"])
    def accept_member_invite(modeladmin, request, queryset):
        success_count = 0

        for invite in queryset:
            try:
                invite.accept()
                success_count += 1
            except Exception as e:
                return messages.error(request, str(e))

        return messages.success(
            request,
            ngettext(
                "%s invites was accepted successfully.",
                "%s invites were accepted successfully",
                success_count,
            ),
        )


admin.site.register(Invite, InviteAdmin)

admin.site.register(Team)
admin.site.register(Membership)

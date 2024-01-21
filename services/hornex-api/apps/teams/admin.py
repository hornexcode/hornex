from django.contrib import admin, messages
from django.utils.html import format_html
from django.utils.translation import ngettext

from apps.teams.models import Invite, Membership, Team


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


class TeamAdmin(admin.ModelAdmin):
    readonly_fields = ("memberships",)
    list_display = (
        "name",
        "game",
        "platform",
        "created_at",
        "updated_at",
        "memberships",
    )

    @admin.display(description="Memberhips")
    def memberships(self, obj):
        content = ""
        for member in obj.members.all():
            content += f"<li>{member.email}</li>"
        return format_html(f"<ul>{content}</ul>")


admin.site.register(Team, TeamAdmin)
admin.site.register(Membership)

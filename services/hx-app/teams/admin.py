from django.contrib import admin
from teams.models import Team, TeamInvite, TeamMember

admin.site.register(Team)
admin.site.register(TeamInvite)
admin.site.register(TeamMember)

from django.contrib import admin
from apps.teams.models import Team, Invite, Membership

admin.site.register(Team)
admin.site.register(Invite)
admin.site.register(Membership)

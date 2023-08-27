from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer

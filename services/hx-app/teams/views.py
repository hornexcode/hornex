from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend

from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["platform", "game"]


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    lookup_field = "id"

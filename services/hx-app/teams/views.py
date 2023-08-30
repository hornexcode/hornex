from rest_framework import viewsets

from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer
from teams.errors import slugs_required


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"

    def list(self, request, *args, **kwargs):
        gslug = request.query_params.get("gslug")
        pslug = request.query_params.get("pslug")

        if not (gslug and pslug):
            return slugs_required

        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user if self.request.user else None

        if user:
            queryset = queryset.filter(teammember__user_id=user.id)

        gslug = self.request.query_params.get("gslug")
        pslug = self.request.query_params.get("pslug")

        queryset = queryset.filter(game__slug=gslug)
        queryset = queryset.filter(platform__slug=pslug)

        return queryset


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    lookup_field = "id"

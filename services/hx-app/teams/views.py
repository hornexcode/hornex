from rest_framework import viewsets

from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer
from .errors import slugs_required, unauthorized
from .filters import TeamFilter
from django_filters import rest_framework as filters


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"
    filter_backends = (filters.DjangoFilterBackend, TeamFilter)

    def list(self, request, *args, **kwargs):
        gslug = request.query_params.get("game")
        pslug = request.query_params.get("platform")

        if not (gslug and pslug):
            return slugs_required

        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        print(instance.created_by.id, request.user.id)

        if instance.created_by.id != request.user.id:
            return unauthorized

        return super().destroy(self, request, *args, **kwargs)


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    lookup_field = "id"

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tournaments.models import Tournament
from tournaments.serializers import TournamentListSerializer, TournamentSerializer


class TournamentReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentListSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"

    def register_team(self, request, id=None):
        """Registers a team for a tournament."""
        t = self.get_object()
        t.register_team(request.user.team)
        return Response(status=status.HTTP_200_OK)

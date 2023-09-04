from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from tournaments.models import Tournament
from tournaments.serializers import (
    TournamentListSerializer,
    TournamentSerializer,
    RegistrationSerializer,
)

from rest_framework import status
from rest_framework.response import Response


class TournamentReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentListSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def register_team(self, request, id=None):
        """Registers a team for a tournament."""

        registration = RegistrationSerializer(data=request.data)
        if not registration.is_valid():
            return Response(registration.errors, status=status.HTTP_400_BAD_REQUEST)

        # get tournament by id
        # get team by id
        # check if tournament is full
        # check if team is already registered

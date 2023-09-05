from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django_filters.rest_framework import DjangoFilterBackend

from tournaments.models import Tournament
from tournaments.filters import TournamentListFilter
from tournaments.serializers import (
    TournamentListSerializer,
    TournamentSerializer,
    RegistrationSerializer,
)
from tournaments.services import TournamentService


class TournamentReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentListSerializer
    lookup_field = "id"
    filter_backends = (DjangoFilterBackend, TournamentListFilter)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    @action(
        detail=True,
        methods=["post"],
    )
    def register(self, request, id=None):
        """Registers a team for a tournament."""
        # validate request
        params = RegistrationSerializer(
            data={**request.data, "tournament": id},
            context={"request": request},
        )
        if not params.is_valid():
            return Response(params.errors, status=status.HTTP_400_BAD_REQUEST)

        # register team
        svc = TournamentService()
        try:
            svc.register(
                team_id=str(params.validated_data["team"]),
                tournament_id=str(params.validated_data["tournament"]),
                user_id=request.user.id,
            )
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)

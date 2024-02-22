from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.tournaments.models import LeagueOfLegendsTournament
from apps.tournaments.serializers import LeagueOfLegendsTournamentSerializer
from apps.tournaments.usecases.organizer.create_tournament import (
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
)
from jwt_token.authentication import JWTAuthentication


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def tournaments_controller(request):
    if request.method == "POST":
        tournament = CreateTournamentUseCase().execute(
            CreateTournamentUseCaseParams(**request.data)
        )
        return Response({"id": tournament.id}, status=status.HTTP_201_CREATED)
    if request.method == "GET":
        user = request.user

        tournaments = LeagueOfLegendsTournament.objects.filter(organizer=user).all()

        return Response(
            LeagueOfLegendsTournamentSerializer(tournaments, many=True).data,
            status=status.HTTP_200_OK,
        )

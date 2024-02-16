from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.tournaments.usecases.admin.create_tournament import (
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
)


@api_view(["POST"])
def tournaments_controller(request):
    tournament = CreateTournamentUseCase().execute(CreateTournamentUseCaseParams(**request.data))
    return Response({"id": tournament.id}, status=status.HTTP_201_CREATED)

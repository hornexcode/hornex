from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets

from apps.games.models import Game
from apps.games.serializers import GameSerializer


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    lookup_field = "id"

    @swagger_auto_schema(
        operation_description="GET /api/v1/games",
        operation_summary="List all games",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/games/<id>",
        operation_summary="Retrieve a game",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

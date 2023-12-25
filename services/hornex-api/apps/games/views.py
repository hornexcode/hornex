from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.games.models import Game, GameID
from apps.games.serializers import GameIDSerializer, GameSerializer


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


class GameIDViewSet(viewsets.ModelViewSet):
    queryset = GameID.objects.all()
    serializer_class = GameIDSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.filter(user=request.user)
        return super().list(request, *args, **kwargs)

from requests import exceptions
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from rest_framework.response import Response
from games.models import Game, GameAccountRiot
from users.models import User
from games.serializers import GameSerializer
from services.riot import client
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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
    @permission_classes([IsAuthenticated])
    def retrieve(self, request, *args, **kwargs):
        print("VVV")
        return super().retrieve(request, *args, **kwargs)


# --------------------------------- Game Account --------------------------------------


def summoner_by_name(name: str, region: str):
    riot_client = client.new_riot_client("RGAPI-67fb115d-cafd-414b-9d5f-3251774f0e24")

    try:
        data = riot_client.get_a_summoner_by_summoner_name(name, region)
    except exceptions.HTTPError as err:
        if err.response.status_code == 403:
            print("API KEY OUTDATED")
            raise exceptions.HTTPError("Internal server error", 500)
        else:
            print(f"HTTP Error {err.response.status_code}")
            raise
    return data


@swagger_auto_schema(
    method="post",
    operation_description="POST /api/v1/games/:id/accounts/connect",
    operation_summary="Connect an user game account to game",
    responses={
        204: openapi.Response("Account connected"),
        404: openapi.Response("Not found"),
        400: openapi.Response("Failed to get summoner by name"),
        400: openapi.Response("Game account already exist"),
    },
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_game_account(request, id):
    user = request.user
    name = request.data.get("name", None)
    region = request.data.get("region", None)
    if not (name and region):
        return Response(
            {"error": "name and region are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        game = get_object_or_404(Game, id=id)
    except ValidationError:
        return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    if game.slug == "league-of-legends":
        try:
            data = summoner_by_name(name, region)
        except exceptions.HTTPError as err:
            print(err)
            return Response(
                {"error": f"Failed to get summoner by name: {err}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        game_account = GameAccountRiot.objects.filter(
            user__id=user.id, encrypted_puuid=data["puuid"]
        )

        if game_account.exists():
            return Response(
                {"error": "Game account already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, pk=user.id)

        riot_account = GameAccountRiot.objects.create(
            user=user,
            game=game,
            encrypted_account_id=data["id"],
            encrypted_puuid=data["puuid"],
            username=data["name"],
            region=data.get("region", GameAccountRiot.RegionChoicesType.BR1),
            encrypted_summoner_id=data["accountId"],
            summoner_name=data["name"],
            summoner_level=data["summonerLevel"],
            revision_date=data["revisionDate"],
        )

    return Response({"message": "Account created"}, status=status.HTTP_204_NO_CONTENT)

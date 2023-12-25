import logging

import requests
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.games.models import GameID
from apps.leagueoflegends.models import LeagueEntry, Summoner
from lib.riot.client import Client

client_id = "6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54"
client_secret = "E9wzc2eEN6Ph5bxdtbxvmef_NJriKXQ0qbgkL9i-DSC"

appCallbackUrl = "https://robin-lasting-magpie.ngrok-free.app/oauth/riot/login"

provider = "https://auth.riotgames.com"
authorizeUrl = provider + "/authorize"
tokenUrl = provider + "/token"

logger = logging.getLogger(__name__)


# https://auth.riotgames.com/authorize?client_id=6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54&redirect_uri=https://robin-lasting-magpie.ngrok-free.app/api/v1/riot/webhooks/oauth2/callback&response_type=code&scope=openid+offline_access
@swagger_auto_schema(
    operation_description="GET /api/v1/riot/webhooks/oauth2/callback",
    operation_summary="It connects logged in user's riot account",
    methods=["get"],
    responses={
        200: openapi.Response(
            "All credentials from riot oauth",
        ),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def riot_oauth_callback(request):
    access_code = request.GET.get("code")
    state = request.GET.get("state", "/")

    form = {
        "grant_type": "authorization_code",
        "code": access_code,
        "redirect_uri": appCallbackUrl,
    }

    try:
        resp = requests.post(
            tokenUrl,
            data=form,
            auth=(client_id, client_secret),
        )
        if not resp.ok:
            print("Error getting token.", resp.json())
            return Response(
                {"message": "Error getting token."}, status=status.HTTP_400_BAD_REQUEST
            )

        token = resp.json()
    except Exception as e:
        return Response(
            {"message": "Something went wrong."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    riot = Client()

    try:
        # TODO: implement riot get account client method
        resp = requests.get(
            "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
            headers={"Authorization": "Bearer " + token.get("access_token")},
        )
        if not resp.ok:
            return Response(
                {"message": "Error retrieving account details"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        account = resp.json()
        print("@step 3: get account", account)
    except Exception as e:
        return Response(
            {"message": "Something went wrong."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    user = request.user

    game_id, created = GameID.objects.update_or_create(
        user=user,
        nickname=account.get("gameName", user.email),
        game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
    )

    summoner_dto = riot.get_summoner_by_name(account.get("gameName"))
    summoner, _ = Summoner.objects.update_or_create(
        user=user,
        id=summoner_dto.id,
        game_id=game_id,
        account_id=summoner_dto.account_id,
        puuid=summoner_dto.puuid,
        name=summoner_dto.name,
    )

    try:
        entries_dto = riot.get_summoner_entries_by_summoner_id(summoner_dto.id)
        for entry in entries_dto:
            if entry.queueType == "RANKED_FLEX_SR":
                league_entry, _ = LeagueEntry.objects.get_or_create(
                    tier=entry.tier,
                    rank=entry.rank,
                )
                summoner.league_entry = league_entry
                summoner.save()
                break

    except Exception as e:
        return Response(
            {"message": "Something went wrong."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {
            **token,
            "return_path": state,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def riot_connect_account(request):
    return Response(
        {
            "redirect_url": f"https://auth.riotgames.com/authorize?client_id=6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54&redirect_uri={appCallbackUrl}&response_type=code&scope=openid+offline_access&state={request.GET.get('return_path', '/')}"
        },
        status=status.HTTP_200_OK,
    )

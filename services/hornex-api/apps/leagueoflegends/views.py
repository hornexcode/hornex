import logging
from dataclasses import dataclass
from datetime import datetime as dt
from datetime import timedelta as td

import requests
from django.db import transaction
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
from apps.leagueoflegends.models import Session
from lib.riot.client import Client

client_id = "6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54"
client_secret = "E9wzc2eEN6Ph5bxdtbxvmef_NJriKXQ0qbgkL9i-DSC"

appCallbackUrl = "https://robin-lasting-magpie.ngrok-free.app/oauth/riot/login"

provider = "https://auth.riotgames.com"
authorizeUrl = provider + "/authorize"
tokenUrl = provider + "/token"

logger = logging.getLogger(__name__)


@dataclass
class GetTokenResponse:
    access_token: str
    expires_in: int
    id_token: str
    refresh_token: str
    scope: str
    token_type: str


def get_token(access_code: str) -> GetTokenResponse:
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
            return Response(
                {"message": "Error getting token."}, status=status.HTTP_400_BAD_REQUEST
            )

        return GetTokenResponse(**resp.json())
    except Exception as e:
        raise Exception from e


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@transaction.atomic
def riot_oauth_callback(request):
    access_code = request.GET.get("code")
    state = request.GET.get("state", "/")

    riot = Client()

    # oauth2 - getting access_token by code
    token = riot.get_oauth_token(access_code)
    if token is None:
        return Response(
            {"message": "Error getting token."}, status=status.HTTP_400_BAD_REQUEST
        )

    # retrieve account details to get summoner name
    riot_account = riot.get_account_me(token.access_token)
    if riot_account is None:
        return Response(
            {"message": "Error getting account."}, status=status.HTTP_400_BAD_REQUEST
        )

    # create game id in case not exists
    gid, _ = GameID.objects.update_or_create(
        user=request.user,
        is_active=True,
        region="Brazil",  # Default value
        region_code=riot_account.tag_line,
        nickname=riot_account.game_name,
        game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
    )

    # expires_in to expires_at
    expires_at = dt.now() + td(seconds=token.expires_in)
    Session.objects.create(
        game_id=gid,
        scope=token.scope,
        expires_at=expires_at,
        token_type=token.token_type,
        refresh_token=token.refresh_token,
        id_token=token.id_token,
        access_token=token.access_token,
    )

    return Response({"return_path": state}, status=status.HTTP_200_OK)


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

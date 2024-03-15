import logging
import os
from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import GameID, Profile
from apps.accounts.serializers import GameIDSerializer, ProfileSerializer
from apps.leagueoflegends.models import Session
from jwt_token.authentication import JWTAuthentication
from lib.riot.client import client as riot

client_id = os.getenv("RIOT_RSO_CLIENT_ID", "")
client_secret = os.getenv("RIOT_RSO_CLIENT_SECRET", "")

appCallbackUrl = os.getenv("APP_URL", "") + "/oauth/riot/login"

provider = os.getenv("RIOT_RSO_PROVIDER_URL", "")
authorizeUrl = provider + "/authorize"
tokenUrl = provider + "/token"

logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@transaction.atomic
def oauth_login_callback(request):
    access_code = request.GET.get("code")
    state = request.GET.get("state", "/")

    # oauth2 - getting access_token by code
    token = riot.get_oauth_token(access_code)
    if token is None:
        return Response(
            {"message": "Error getting token."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # retrieve account details to get summoner name
    riot_account = riot.get_account_me(token.access_token)
    if riot_account is None:
        return Response(
            {"message": "Error getting account."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # create game id in case not exists
    gid, _ = GameID.objects.update_or_create(
        user=request.user,
        is_active=True,
        metadata={
            "puuid": riot_account.puuid,
            "region": "Brazil",
            "tag_line": riot_account.tag_line,
        },
        nickname=riot_account.game_name,
        game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
    )

    # expires_in to expires_at
    expires_at = dt.now(tz=UTC) + td(seconds=token.expires_in)
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
def oauth_login(request):
    return Response(
        {
            "redirect_url": "https://auth.riotgames.com/authorize?"
            f"client_id={client_id}&redirect_uri="
            f"{appCallbackUrl}&response_type=code&scope=openid+offline_access&"
            f"state={request.GET.get('return_path', '/')}"
        },
        status=status.HTTP_200_OK,
    )


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class GameIDViewSet(viewsets.ModelViewSet):
    queryset = GameID.objects.all()
    serializer_class = GameIDSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

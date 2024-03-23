import json
import logging
import os
from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import (
    action,
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import GameID, Profile
from apps.accounts.serializers import GameIDSerializer, ProfileSerializer
from lib.jwt.authentication import JWTAuthentication
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
    GameID.objects.update_or_create(
        user=request.user,
        is_active=True,
        metadata=json.dumps(
            {
                "puuid": riot_account.puuid,
                "region": "Brazil",
                "tag_line": riot_account.tag_line,
                "access_token": token.access_token,
                "expires_at": (
                    dt.now(tz=UTC) + td(seconds=token.expires_in)
                ).isoformat(),
                "refresh_token": token.refresh_token,
                "id_token": token.id_token,
            }
        ),
        nickname=riot_account.game_name,
        game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
    )

    # expires_in to expires_at
    # expires_at = dt.now(tz=UTC) + td(seconds=token.expires_in)

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


@api_view(["GET", "POST", "PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == "GET":
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(instance=profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        data = {"user": request.user.id, **request.data}
        print(data)
        serializer = ProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "PATCH":
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(
            instance=profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class GameIDViewSet(viewsets.ModelViewSet):
    queryset = GameID.objects.all()
    serializer_class = GameIDSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user, deleted_at__isnull=True)

    @action(detail=True, methods=["delete"])
    def disconnect(self, request, *args, **kwargs):
        game_id = self.get_object()
        if game_id.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        game_id.is_active = False
        game_id.deleted_at = dt.now(tz=UTC)
        game_id.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

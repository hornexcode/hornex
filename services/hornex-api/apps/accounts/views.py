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

from apps.accounts.models import Classification, LeagueOfLegendsAccount
from lib.riot.client import Client

client_id = "6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54"
client_secret = "E9wzc2eEN6Ph5bxdtbxvmef_NJriKXQ0qbgkL9i-DSC"

appCallbackUrl = (
    "https://robin-lasting-magpie.ngrok-free.app/api/v1/riot/webhooks/oauth2/callback"
)

provider = "https://auth.riotgames.com"
authorizeUrl = provider + "/authorize"
tokenUrl = provider + "/token"


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
    user = request.user
    if not user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    # post information as x-www-form-urlencoded
    form = {
        "grant_type": "authorization_code",
        "code": access_code,
        "redirect_uri": appCallbackUrl,
    }

    is_new = True
    try:
        # It will throw an exception whenever the user does not have acc.
        user.leagueoflegendsaccount
        is_new = False
    except LeagueOfLegendsAccount.DoesNotExist:
        is_new = True

    if is_new:
        account = LeagueOfLegendsAccount()
        account.user = user

        return create_or_update_leagueoflegends_account(form, account)
    else:
        account: LeagueOfLegendsAccount = user.leagueoflegendsaccount
        return create_or_update_leagueoflegends_account(form, account)


def create_or_update_leagueoflegends_account(
    form: dict, account: LeagueOfLegendsAccount
):
    riot_client = Client()
    try:
        resp = requests.post(
            tokenUrl,
            data=form,
            auth=(client_id, client_secret),
        )
        data = resp.json()

        if resp.ok:
            ui_resp = requests.get(
                "https://auth.riotgames.com/userinfo",
                headers={"Authorization": "Bearer " + data.get("access_token")},
            )
            ui = ui_resp.json()
            account.sub = ui.get("sub")
            account.sub = ui.get("jti")

            accme_resp = requests.get(
                "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
                headers={"Authorization": "Bearer " + data.get("access_token")},
            )
            accme = accme_resp.json()
            account.tag_line = accme.get("tagLine")

            summonerme_resp = requests.get(
                "https://br1.api.riotgames.com/lol/summoner/v4/summoners/me",
                headers={"Authorization": "Bearer " + data.get("access_token")},
            )

            summonerme = summonerme_resp.json()
            account.summoner_id = summonerme.get("id")
            account.account_id = summonerme.get("accountId")
            account.puuid = summonerme.get("puuid")
            account.summoner_name = summonerme.get("name")
            account.profile_icon_id = summonerme.get("profileIconId")
            account.revision_date = summonerme.get("revisionDate")
            account.summoner_level = summonerme.get("summonerLevel")

            entries = riot_client.get_entries_by_summoner_id(account.summoner_id)

            if not entries:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            classification = Classification.objects.get(
                tier=entries[0].tier, rank=entries[0].rank
            )
            account.classification = classification
            account.save()

            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    except requests.RequestException:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except Classification.DoesNotExist:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

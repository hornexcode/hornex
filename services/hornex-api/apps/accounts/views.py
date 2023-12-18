import requests
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from apps.accounts.models import LeagueOfLegendsAccount
from apps.users.models import User

client_id = "6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54"
client_secret = "E9wzc2eEN6Ph5bxdtbxvmef_NJriKXQ0qbgkL9i-DSC"

appCallbackUrl = (
    "https://f4ad-45-169-190-206.ngrok-free.app/api/v1/riot/webhooks/oauth2/callback"
)

provider = "https://auth.riotgames.com"
authorizeUrl = provider + "/authorize"
tokenUrl = provider + "/token"


@api_view(["GET"])
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

    is_new = False

    try:
        resp = requests.post(
            tokenUrl,
            data=form,
            auth=(client_id, client_secret),
        )
        print(resp.json())
        if resp.ok:
            ui_resp = requests.get(
                "https://auth.riotgames.com/userinfo",
                headers={"Authorization": "Bearer " + resp.json()["access_token"]},
            )
            print("user_info -> ", ui_resp.json())

            accme_resp = requests.get(
                "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
                headers={"Authorization": "Bearer " + resp.json()["access_token"]},
            )
            print("accme_resp -> ", accme_resp.json())

            summonerme = requests.get(
                "https://br1.api.riotgames.com/lol/summoner/v4/summoners/me",
                headers={"Authorization": "Bearer " + resp.json()["access_token"]},
            )
            print("summonerme -> ", summonerme.json())

            return Response(resp.json(), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    except requests.RequestException as e:
        print(e)
        return Response(status=status.HTTP_400_BAD_REQUEST)


def create_leagueoflegends_account():
    pass

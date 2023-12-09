from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response


def oauth_riot_authenticate(request):
    client_id = "RGAPI-3b6d2d0d-9e3e-4a4a-9d5a-6a2b2d1b2d3d"
    client_secret = "Z2Z6Z"

    app_base_url = "http://localhost:8000"
    app_callback_url = f"{app_base_url}/api/v1/oauth/riot"

    return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
def webhook_oauth_riot(request):
    print(request.data)
    return Response(status=status.HTTP_200_OK)

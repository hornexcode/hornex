from django.urls import path
from apps.accounts.views import riot_oauth_callback

urlpatterns = [
    path("/oauth2/callback", riot_oauth_callback),
]

from django.urls import path
from apps.accounts.views import webhook_oauth_riot

urlpatterns = [
    path("/riot/oauth/callback", webhook_oauth_riot),
]

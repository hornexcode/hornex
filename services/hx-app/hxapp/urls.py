from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    # jwt
    path("api/v1/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    # api/v1
    path("api/v1/users", include("users.urls")),
    path("api/v1/teams", include("teams.urls")),
    path("api/v1/invites", include("invites.urls")),
    path("api/v1/tournaments", include("tournaments.urls")),
]

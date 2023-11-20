from django.contrib import admin
from django.urls import path, include

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

prefix = "api/v1/<str:platform>/<str:game>"

urlpatterns = [
    # swagger
    path(
        "swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # admin
    path("admin/", admin.site.urls),
    # dev internal api
    path("api-auth/", include("rest_framework.urls")),
    # jwt
    path("api/v1/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    # api/v1
    path("api/v1/users", include("users.urls")),
    path("api/v1/invites", include("invites.urls")),
    path("api/v1/platforms", include("platforms.urls")),
    path("api/v1/teams", include("teams.urls")),
    path("api/v1/games", include("games.urls")),
    path("api/v1/payments", include("payments.urls")),
    # api/v1/<platform>/<game>
    path(f"{prefix}/tournaments", include("tournaments.urls")),
]

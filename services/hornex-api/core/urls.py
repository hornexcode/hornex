from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from apps.notifications.consumers import NotificationConsumer
from core.healthcheck import health
from jwt_token.views import (
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

urlpatterns = [
    # swagger
    path(
        "swagger<format>/",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "redoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    path("v1/webhooks", include("apps.webhooks.urls")),
    # admin
    path("admin/", admin.site.urls),
    # dev internal api
    path("api/auth/", include("rest_framework.urls")),
    # jwt
    path("api/v1/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    # api/v1
    path("api/v1/accounts", include("apps.accounts.urls")),
    path("api/v1/users", include("apps.users.urls")),
    path("api/v1/platforms", include("apps.platforms.urls")),
    path("api/v1/teams", include("apps.teams.urls")),
    path("api/v1/games", include("apps.games.urls")),
    path("api/v1/payments", include("apps.payments.urls")),
    path("api/v1/notifications", include("apps.notifications.urls")),
    path("api/v1/configs", include("apps.configs.urls")),
    # webhooks
    # health check
    path("api/v1/health/check", health),
    #
    path("api/v1", include("apps.tournaments.urls")),
]

websocket_urlpatterns = [
    path("ws/notifications", NotificationConsumer.as_asgi()),
]

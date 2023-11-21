from django.urls import path
from apps.platforms.views import PlatformViewSet

urlpatterns = [path("", PlatformViewSet.as_view({"get": "list"}))]

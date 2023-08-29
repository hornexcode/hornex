from django.urls import path
from platforms.views import PlatformViewSet

urlpatterns = [path("", PlatformViewSet.as_view({"get": "list"}))]

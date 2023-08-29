from django.urls import path
from games.views import GameViewSet

urlpatterns = [path("", GameViewSet.as_view({"get": "list"}))]

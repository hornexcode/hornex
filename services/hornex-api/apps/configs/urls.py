from django.urls import path

from apps.configs.views import ConfigViewSet

urlpatterns = [
    path(
        "/<str:name>",
        ConfigViewSet.as_view({"get": "retrieve", "put": "update"}),
        name="details-view",
    ),
]

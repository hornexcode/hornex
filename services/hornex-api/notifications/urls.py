from django.urls import path
from notifications.views import NotificationViewSet


urlpatterns = [
    path(
        "",
        NotificationViewSet.as_view({"get": "list", "post": "create"}),
        name="notification-list",
    ),
    path(
        "/<str:id>",
        NotificationViewSet.as_view(
            {
                "get": "retrieve",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="notification-details",
    ),
]

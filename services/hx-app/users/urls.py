from django.urls import path
from users.views import UserViewSet, current_user


urlpatterns = [
    path("/current-user", current_user, name="current-user"),
    # -
    path("", UserViewSet.as_view({"get": "list"}), name="user-list"),
]

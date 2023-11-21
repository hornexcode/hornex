from django.urls import path
from apps.users.views import UserViewSet, current_user, search_user


urlpatterns = [
    path("/current-user", current_user, name="current-user"),
    path("/search", search_user, name="search-user"),
    # -
    path("", UserViewSet.as_view({"get": "list", "post": "create"}), name="user"),
    path("/register", UserViewSet.as_view({"post": "create"}), name="register-user"),
]

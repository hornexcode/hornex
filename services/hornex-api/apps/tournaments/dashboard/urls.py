from django.urls import path

from apps.tournaments.dashboard.views import tournaments_controller

app_name = "tournaments"

urlpatterns = [
    path(
        "/tournaments",
        tournaments_controller,
        name="dashboard-tournaments-controller",
    ),
]

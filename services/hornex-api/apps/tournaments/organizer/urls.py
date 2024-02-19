from django.urls import path

from apps.tournaments.organizer.views import tournaments_controller

app_name = "tournaments"

urlpatterns = [
    path(
        "/tournaments",
        tournaments_controller,
        name="organizer-tournaments-controller",
    ),
]

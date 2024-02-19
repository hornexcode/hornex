from django.urls import path

<<<<<<<< HEAD:services/hornex-api/apps/tournaments/dashboard/urls.py
from apps.tournaments.dashboard.views import tournaments_controller
========
from apps.tournaments.organizer.views import tournaments_controller
>>>>>>>> 26bf366 (chore: initial setup):services/hornex-api/apps/tournaments/organizer/urls.py

app_name = "tournaments"

urlpatterns = [
    path(
        "/tournaments",
        tournaments_controller,
<<<<<<<< HEAD:services/hornex-api/apps/tournaments/dashboard/urls.py
        name="dashboard-tournaments-controller",
========
        name="organizer-tournaments-controller",
>>>>>>>> 26bf366 (chore: initial setup):services/hornex-api/apps/tournaments/organizer/urls.py
    ),
]

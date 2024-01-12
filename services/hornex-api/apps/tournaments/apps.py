from django.apps import AppConfig


class TournamentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.tournaments"
    label = "tournaments"

    def ready(self):
        # ruff: noqa: F401
        import apps.tournaments.signals

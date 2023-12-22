from django.apps import AppConfig


class TeamsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.teams"

    def ready(self):
        # ruff: noqa: F401
        import apps.teams.signals

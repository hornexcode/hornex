from django.apps import AppConfig


class LeagueoflegendsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.leagueoflegends"

    def ready(self):
        # ruff: noqa: F401
        import apps.leagueoflegends.signals

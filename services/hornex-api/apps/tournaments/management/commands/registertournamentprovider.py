from django.core.management.base import BaseCommand, CommandError
from apps.tournaments.leagueoflegends.models import LeagueOfLegendsTournamentProvider
from lib.riot.client import Client


class Command(BaseCommand):
    help = "Register an league of tournament provider for managing tournaments and receive its information"

    def add_arguments(self, parser):
        parser.add_argument("region", type=LeagueOfLegendsTournamentProvider.RegionType)
        parser.add_argument("url", type=str)

    def handle(self, *args, **options):
        riot = Client()
        region = options.get("region", "")
        url = options.get("url", "")

        try:
            provider_id = riot.register_tournament_provider(url, region)
        except Exception as e:
            raise CommandError(e)

        try:
            LeagueOfLegendsTournamentProvider.objects.create(
                region=region, url=url, provider_id=provider_id
            )
        except Exception as e:
            raise CommandError(f"Failed to create provider: {e}")
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    'Successfully created tournament provider of id "%s"' % provider_id
                )
            )

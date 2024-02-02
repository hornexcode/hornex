from django.core.management.base import BaseCommand

from lib.challonge import Tournament as ChallongeTournamentResourceAPI


class Command(BaseCommand):
    help = "Delete all tournaments in Challonge"

    def handle(self, *args, **options):
        tournaments = ChallongeTournamentResourceAPI.list()
        for tournament in tournaments:
            id = tournament["tournament"]["id"]
            ChallongeTournamentResourceAPI.destroy(tournament["tournament"]["id"])
            self.stdout.write(
                self.style.SUCCESS('Successfully deleted tournament of id "%s"' % id)
            )

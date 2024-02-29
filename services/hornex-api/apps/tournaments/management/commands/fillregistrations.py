from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from faker import Faker

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.tournaments.models import Registration, Tournament
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

fake = Faker()


class Command(BaseCommand):
    help = "Fill registrations for a tournament"

    def add_arguments(self, parser):
        parser.add_argument("tournament", type=str)

    def handle(self, *args, **options):
        with transaction.atomic():
            tournament_uuid = options.get("tournament")
            if not tournament_uuid:
                raise CommandError("Tournament uuid is required")

            try:
                tournament = Tournament.objects.get(uuid=tournament_uuid)
            except Tournament.DoesNotExist:
                raise CommandError(f"Tournament {tournament_uuid} does not exist")

            registrations = Registration.objects.filter(tournament=tournament)
            remaining = tournament.max_teams - registrations.count()

            for _ in range(remaining):
                team = create_team()
                participant = ChallongeTournament.add_team(
                    tournament=tournament.challonge_tournament_id, team_name=team.name
                )
                Registration.objects.create(
                    tournament=tournament,
                    team=team,
                    status=Registration.RegistrationStatusOptions.ACCEPTED,
                    game_slug=tournament.game,
                    platform_slug=tournament.platform,
                    challonge_participant_id=participant["id"],
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully filled registrations for tournament {tournament_uuid}"
                )
            )


def create_team():
    owner = create_user()
    team = Team.objects.create(
        name=fake.company(),
        description="sadasd",
        created_by=owner,
    )

    for _ in range(4):
        gameid = create_gameid()
        team.members.add(gameid)

    return team


def create_user():
    return User.objects.create(
        email=fake.email(),
        password=fake.password(),
        name=fake.first_name(),
    )


def create_gameid():
    return GameID.objects.create(
        user=create_user(),
        game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
        nickname=fake.user_name(),
    )

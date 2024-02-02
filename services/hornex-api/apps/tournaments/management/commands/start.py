import faker
import structlog
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.leagueoflegends.models import Tournament
from apps.teams.models import Membership, Team
from apps.users.models import User

logger = structlog.get_logger(__name__)


fake = faker.Faker()


class Command(BaseCommand):
    help = "Starts a tournament"

    def add_arguments(self, parser):
        parser.add_argument("--tournament", type=str)

    def handle(self, *args, **options):
        logger.info("Starting tournament...", tournament=options["tournament"])

        try:
            tournament = Tournament.objects.get(id=options["tournament"])
        except Tournament.DoesNotExist:
            raise CommandError("Tournament does not exist")

        with transaction.atomic():
            tester = User.objects.create(
                name="admin", email="tester@hornex.gg", password="test"
            )
            # create 5 teams
            teams: Team = []
            for i in range(5):
                team = Team.objects.create(name=f"Team {i + 1}", created_by=tester)
                teams.append(team)
                logger.info("Team created", team=team)

            for team in teams:
                Membership.objects.create(
                    team=team,
                    user=User.objects.create(
                        name=fake.name(), email=fake.email(), password="test"
                    ),
                )
                logger.info("Team configured", team=team)

            tournament.teams.set(teams)
            logger.info("Tournament configured", tournament=tournament)

            raise Exception("End")

            # start_at = datetime.combine(tournament.start_date, tournament.start_time)

            # resp = ChallongeTournamentResourceAPI.create(
            #     name=tournament.name,
            #     tournament_type="single elimination",
            #     start_at=start_at,
            # )

            # logger.info("Tournament created on provider", resp=resp)

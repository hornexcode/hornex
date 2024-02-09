import time
from datetime import datetime as dt
from datetime import timedelta as td

import structlog
from django.core.management.base import BaseCommand
from faker import Faker

from apps.leagueoflegends.models import LeagueEntry, Tournament
from apps.teams.models import Team
from apps.tournaments.models import Checkin
from apps.users.models import User

logger = structlog.get_logger(__name__)


fake = Faker()


class Command(BaseCommand):
    help = "Creates a stub tournament"

    def handle(self, *args, **options):
        now = dt.utcnow()
        logger.info("Creating tournament...", now=now)

        tester = User.objects.create(name="admin", email="tester@hornex.gg", password="test")

        bronze_tier, _ = LeagueEntry.objects.get_or_create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )
        silver_tier, _ = LeagueEntry.objects.get_or_create(
            tier=LeagueEntry.TierOptions.SILVER, rank=LeagueEntry.RankOptions.I
        )

        t = Tournament.objects.create(
            name=f"Test Tournament {now.microsecond}",
            description="Torneio de League of Legends do Hornex",
            game=Tournament.GameType.LEAGUE_OF_LEGENDS,
            organizer=tester,
            start_date=now,
            end_date=now,
            start_time=now + td(minutes=10),
            end_time=now + td(minutes=30),
            check_in_duration=30,
            registration_start_date=now,
            registration_end_date=now + td(minutes=20),
            feature_image="tmt-6.jpeg",
            is_public=True,  # change to is_published
            entry_fee=500,  # 5.00
            max_teams=32,
            team_size=5,
            is_classification_open=False,
        )

        t.allowed_league_entries.set([bronze_tier, silver_tier])

        time.sleep(5)
        print("")
        print("")
        print("")

        tournament = Tournament.objects.first()

        # create 5 teams
        teams: Team = []
        for i in range(4):
            team = Team.objects.create(name=f"Team {i + 1}", created_by=tester)
            teams.append(team)
            logger.info("Team created", team=team)

        for team in teams:
            for i in range(5):
                team.members.add(User.objects.create(name=f"User {i + 1}"))
            logger.info("Team configured", team=team)

        tournament.teams.set(teams)

        logger.info("Tournament configured", tournament=tournament)

        time.sleep(5)
        print("")
        print("")
        print("")

        logger.info("Creating checkins")

        for team in teams:
            for user in team.members.all():
                logger.info("Creating checkin for user", user=user)
                Checkin.objects.create(
                    tournament=tournament,
                    team=team,
                    user=user,
                )

        time.sleep(300)

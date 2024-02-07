import time
from datetime import datetime as dt
from datetime import timedelta as td

import structlog
from django.core.management.base import BaseCommand
from faker import Faker

from apps.leagueoflegends.models import LeagueEntry, Tournament
from apps.teams.models import Membership, Team
from apps.users.models import User

logger = structlog.get_logger(__name__)


fake = Faker()


class Command(BaseCommand):
    help = "Creates a stub tournament"

    def handle(self, *args, **options):
        now = dt.utcnow()

        tester = User.objects.first()

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

        tournament = Tournament.objects.first()

        # create 5 teams
        teams: Team = []
        for i in range(4):
            team = Team.objects.create(name=f"Team {i + 1}", created_by=tester)
            teams.append(team)
            logger.info("Team created", team=team)

        for team in teams:
            for i in range(5):
                Membership.objects.create(
                    team=team,
                    user=User.objects.create(
                        name=fake.name(), email=fake.email(), password="test"
                    ),
                )
            logger.info("Team configured", team=team)

        tournament.teams.set(teams)
        logger.info("Tournament configured", tournament=tournament)

        time.sleep(5)

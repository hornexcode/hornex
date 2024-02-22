from datetime import UTC, time
from datetime import datetime as dt
from datetime import timedelta as td

import structlog
from django.core.management.base import BaseCommand
from django.db import transaction
from faker import Faker

from apps.tournaments.models import LeagueOfLegendsLeague, LeagueOfLegendsTournament
from apps.users.models import User
from lib.challonge import Tournament

logger = structlog.get_logger(__name__)


fake = Faker()


class Command(BaseCommand):
    help = "Creates a stub tournament"

    @transaction.atomic
    def handle(self, *args, **options):
        user = User.objects.get(email="admin@hornex.gg")

        league, _ = LeagueOfLegendsLeague.objects.get_or_create(
            tier="DIAMOND",
            rank="I",
        )

        now = dt.now(tz=UTC)

        LeagueOfLegendsTournament.objects.create(
            name="Second Tournament Enabler Summoner 2k24",
            description="This is a test tournament",
            registration_start_date=now,
            start_date=now + td(days=3),
            end_date=now + td(days=6),
            start_time=time(9, 40, 0),
            end_time=time(18, 0, 0),
            check_in_duration=15,
            organizer=user,
            entry_fee=5000,
            feature_image="tmt-3.jpeg",
        )
        tournament = LeagueOfLegendsTournament.objects.first()
        tournament.classifications.add(league)
        tournament.save()

        self.stdout.write(self.style.SUCCESS(f"Tournament {tournament.name} created"))

        start_at = dt.combine(tournament.start_date, tournament.start_time).strftime(
            "%Y-%m-%dT%H:%M:%S%+00:00"  # need to add timezone in order to work
        )
        ch_tournament = Tournament.create(
            name=tournament.name,
            teams=True,
            start_at=start_at,
            check_in_duration=tournament.check_in_duration,
            game="League of Legends",
        )

        self.stdout.write(self.style.SUCCESS(f"Challonge Tournament {tournament.name} created"))

        if not tournament.id:
            raise ValueError("Tournament not created at challonge")

        tournament.challonge_tournament_id = ch_tournament.id
        tournament.challonge_tournament_url = f"https://challonge.com/{ch_tournament.url}"

        tournament.save()

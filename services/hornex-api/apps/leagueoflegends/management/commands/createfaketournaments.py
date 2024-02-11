from datetime import datetime as dt
from datetime import timedelta as td

from django.core.management.base import BaseCommand

from apps.leagueoflegends.models import LeagueEntry, Tournament
from apps.users.models import User


class Command(BaseCommand):
    help = "Create fake tournaments"

    def handle(self, *args, **options):
        user = User.objects.first()

        now = dt.utcnow()
        tournament = Tournament.objects.create(
            name="Torneio de League of Legends",
            organizer=user,
            registration_start_date=now,
            registration_end_date=now + td(days=2),
            start_date=now + td(days=3),
            end_date=now + td(days=4),
            start_time=now,
            end_time=now + td(hours=2),
            feature_image="tmt-6.jpeg",
            entry_fee=25,
            max_teams=32,
            team_size=5,
            published=True,
        )
        tournament.allowed_league_entries.set(
            [
                LeagueEntry.objects.create(tier="IRON", rank="I"),
                LeagueEntry.objects.create(tier="BRONZE", rank="I"),
            ]
        )
        tournament.save()

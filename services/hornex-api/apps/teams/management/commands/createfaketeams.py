from datetime import datetime as dt

import faker
from django.core.management.base import BaseCommand

from apps.leagueoflegends.models import GameID, LeagueEntry, Summoner
from apps.teams.models import Team
from apps.users.models import User

fake = faker.Faker()


class Command(BaseCommand):
    help = "Create fake teams"

    def handle(self, *args, **options):
        superuser = User.objects.get(email="admin@hornex.gg")
        Team.objects.all().delete()

        users = [superuser]
        pill = [superuser]
        league_entry = LeagueEntry.objects.first()

        for _ in range(159):
            user = User.objects.create_user(
                email=fake.email().split("@")[0]
                + f"+{round(dt.now().timestamp() * 1000)}"
                + "@hornex.gg",
                name=fake.name(),
                password="admin",
            )
            users.append(user)
            pill.append(user)

            game_id = GameID.objects.create(
                user=user,
                game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
                nickname=fake.name(),
                is_active=True,
                region="BR",
                region_code="BR",
            )

            Summoner.objects.create(
                game_id=game_id,
                id=fake.uuid4(),
                puuid=fake.uuid4(),
                account_id=fake.uuid4(),
                name=fake.name(),
                league_entry=league_entry,
            )

            if len(pill) == 5:
                team = Team.objects.create(
                    name=fake.company(),
                    description=fake.text(),
                    created_by=users[0],
                    game=Team.GameType.LEAGUE_OF_LEGENDS,
                    platform=Team.PlatformType.PC,
                )
                for pill_user in pill:
                    team.add_member(pill_user, is_admin=True)
                pill = []

        assert len(Team.objects.all()) == 32

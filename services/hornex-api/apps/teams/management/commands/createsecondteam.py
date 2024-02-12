import faker
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.users.models import User
from lib.riot import Summoner as SummonerAPIResource

fake = faker.Faker()


class Command(BaseCommand):
    help = "Create default team"

    @transaction.atomic
    def handle(self, *args, **options):
        user1 = User.objects.get(email="admin@hornex.gg")
        team = Team.objects.create(
            name="Hx Team v2",
            description="test description",
            created_by=user1,
        )
        # add member to team
        team.add_member(user1, is_admin=True)

        # get league of legends summoner
        summoner = SummonerAPIResource.get_by_summoner_name("Fellipe gostosão")
        if summoner.id:
            # create gameid if account exists
            GameID.objects.create(
                game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
                nickname=summoner.name,
                is_active=True,
                user=user1,
                metadata={"region": "BR"},
            )

        accounts = ["Negão", "Letfixxy", "Harishow manér", "Valinzin"]
        for account in accounts:
            user = User.objects.create(email=fake.email())
            connect_account(user, team, account)

        self.stdout.write(self.style.SUCCESS(f"Default team created: {team}"))


def connect_account(user: User, team: Team, summoner_name: str):
    # add member to team
    team.add_member(user, is_admin=True)

    # get league of legends summoner
    summoner = SummonerAPIResource.get_by_summoner_name(summoner_name)
    if summoner.id:
        # create gameid if account exists
        GameID.objects.create(
            game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
            nickname=summoner.name,
            is_active=True,
            user=user,
        )

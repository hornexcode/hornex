import faker
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import LeagueOfLegendsSummoner
from apps.games.models import GameID
from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsEllo
from apps.users.models import User
from lib.riot import LeagueV4
from lib.riot import Summoner as SummonerAPIResource

fake = faker.Faker()


class Command(BaseCommand):
    help = "Create default team"

    @transaction.atomic
    def handle(self, *args, **options):
        user1 = User.objects.get(email="admin@hornex.gg")
        team = Team.objects.create(
            name="Hx Team v1",
            description="test description",
            created_by=user1,
        )
        # add member to team
        team.add_member(user1, is_admin=True)

        # get league of legends summoner
        summoner = SummonerAPIResource.get_by_summoner_name("Fellipe gostosão")
        if summoner.id:
            # create gameid if account exists
            gameid = GameID.objects.create(
                game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
                nickname=summoner.name,
                is_active=True,
                user=user1,
            )

            # create summoner on database
            lolsumm = LeagueOfLegendsSummoner.objects.create(
                id=summoner.id,
                game_id=gameid,
                puuid=summoner.puuid,
                name=summoner.name,
            )

            # get ello from league of legends api by summoner id
            league_entries = LeagueV4.get_all_league_entries_by_summoner_id(summoner.id)
            ranked_solo_entry = next(
                (entry for entry in league_entries if entry.queue_type == "RANKED_SOLO_5x5"), None
            )

            if ranked_solo_entry:
                # create ello on database
                ello, _ = LeagueOfLegendsEllo.objects.get_or_create(
                    queue_type=ranked_solo_entry.queue_type,
                    tier=ranked_solo_entry.tier,
                    rank=ranked_solo_entry.rank,
                )
                lolsumm.ello = ello
                lolsumm.save()

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
        gameid = GameID.objects.create(
            game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
            nickname=summoner.name,
            is_active=True,
            user=user,
        )

        # create summoner on database
        lolsumm = LeagueOfLegendsSummoner.objects.create(
            id=summoner.id,
            game_id=gameid,
            puuid=summoner.puuid,
            name=summoner.name,
        )

        # get ello from league of legends api by summoner id
        league_entries = LeagueV4.get_all_league_entries_by_summoner_id(summoner.id)
        ranked_solo_entry = next(
            (entry for entry in league_entries if entry.queue_type == "RANKED_SOLO_5x5"), None
        )

        if ranked_solo_entry:
            # create ello on database
            ello, _ = LeagueOfLegendsEllo.objects.get_or_create(
                queue_type=ranked_solo_entry.queue_type,
                tier=ranked_solo_entry.tier,
                rank=ranked_solo_entry.rank,
            )
            lolsumm.ello = ello
            lolsumm.save()

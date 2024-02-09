from django.test import TestCase

from apps.games.models import GameID
from apps.leagueoflegends.models import LeagueEntry, Summoner
from apps.users.models import User


class TestUnitUserModel(TestCase):
    def setUp(self):
        user = User.objects.create(email="test@hornex.gg")
        gid = GameID.objects.create(
            user=user,
            region="Brazil",
            region_code="BR1",
            game="league-of-legends",
            nickname="test-nickname",
            is_active=True,
        )
        Summoner.objects.create(
            name="test-summoner",
            account_id="test-account-id",
            puuid="test-puuid",
            game_id=gid,
            league_entry=LeagueEntry.objects.create(
                rank=LeagueEntry.RankOptions.I,
                tier=LeagueEntry.TierOptions.IRON,
            ),
        )

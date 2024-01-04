from unittest.mock import Mock, patch

from django.test import TestCase

from apps.games.models import GameID
from apps.leagueoflegends.models import LeagueEntry, Summoner
from apps.tournaments.models import Tournament
from apps.users.models import User
from lib.riot.types import SummonerDTO


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
                rank=LeagueEntry.RankOptions.I, tier=LeagueEntry.TierOptions.IRON
            ),
        )

    @patch("lib.riot.client.Client.get_entries_by_summoner_id")
    @patch("lib.riot.client.Client.get_summoner_by_name")
    def test_can_play(self, mock_get_summoner_by_name, mock_get_entries_by_summoner_id):
        mock_get_summoner_by_name.return_value = SummonerDTO(
            id="id",
            account_id="accountId",
            puuid="puuid",
            name="name",
        )

        mock_get_entries_by_summoner_id.return_value = [Mock(rank="I", tier="IRON")]
        user = User.objects.get(email="test@hornex.gg")

        self.assertTrue(
            user.can_play(
                Tournament.GameType.LEAGUE_OF_LEGENDS, ["IRON I", "IRON II", "GOLD I"]
            )
        )
        self.assertFalse(
            user.can_play(
                Tournament.GameType.LEAGUE_OF_LEGENDS,
                ["DIAMOND I", "DIAMOND II", "GOLD I"],
            )
        )

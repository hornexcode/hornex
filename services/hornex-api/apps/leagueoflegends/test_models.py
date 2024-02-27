from datetime import UTC, datetime
from datetime import timedelta as td
from test.factories import UserFactory

from django.test import TestCase

from apps.leagueoflegends.models import LeagueEntry, Tournament


class TestUnitTournamentModel(TestCase):
    def setUp(self):
        now = datetime(tzinfo=UTC)
        tournament = Tournament.objects.create(
            name="test-tournament",
            game=Tournament.GameType.LEAGUE_OF_LEGENDS,
            max_teams=8,
            entry_fee=10,
            registration_start_date=now,
            start_date=now + td(days=7),
            start_time="10:00:00",
            organizer=UserFactory.new(),
        )

        self.league_entries = [
            LeagueEntry.objects.create(
                tier=LeagueEntry.TierOptions.IRON,
                rank=LeagueEntry.RankOptions.I,
            ),
            LeagueEntry.objects.create(
                tier=LeagueEntry.TierOptions.IRON,
                rank=LeagueEntry.RankOptions.II,
            ),
        ]
        tournament.allowed_league_entries.set(self.league_entries)
        tournament.save()

    # @patch("apps.teams.signals.send_notification")
    # def test_get_classifications(self):
    #     tournament = Tournament.objects.get(name="test-tournament")
    #     self.assertEqual(
    #         tournament.get_classifications(),
    #         [f"{entry.tier} {entry.rank}" for entry in self.league_entries],
    #     )

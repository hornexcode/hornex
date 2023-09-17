# Should be integration tests
import mock
from django.test import TestCase
from tournaments.events import TournamentRegistrationConfirmed


class TestTournamentManagementServiceHelpers(TestCase):
    def test_produce_tournament_registration_confirmed_event_ok(self):
        with mock.patch(
            "tournaments.services.register_tournament_for_game.delay"
        ) as delay_mock:
            from tournaments.services import (
                produce_tournament_registration_confirmed_event,
            )

            msg_stub = TournamentRegistrationConfirmed(
                tournament_id="tournament_id",
                team_id="tournament_team_id",
                game_slug="game_slug",
                user_id="user_id",
            )
            produce_tournament_registration_confirmed_event(msg_stub)

            delay_mock.assert_called_once_with("tournament_id", "team_id")

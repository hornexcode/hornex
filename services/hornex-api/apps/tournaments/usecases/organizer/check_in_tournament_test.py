from datetime import datetime, timedelta
from test.factories import LeagueOfLegendsTournamentFactory, TeamFactory

from django.test import TestCase

from apps.tournaments.models import Registration
from apps.tournaments.usecases.organizer import (
    CheckInTournamentInput,
    CheckInTournamentUseCase,
)
from apps.users.models import User


class CheckInTournamentUseCaseTest(TestCase):
    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            start_date=datetime.now(),
            start_time=(datetime.now() + timedelta(minutes=12)).time(),
            challonge_tournament_id=123,
        )

        self.team = TeamFactory.new(created_by=self.user, name="Escholar")

        self.registration = Registration.objects.create(
            team=self.team,
            tournament=self.tournament,
            game_slug="league-of-legends",
            platform_slug="pc",
            challonge_participant_id=123,
        )

    def test_check_in_tournament(self):
        CheckInTournamentUseCase().execute(
            CheckInTournamentInput(
                organizer_id=self.user.id, tournament_id=self.tournament.id
            )
        )

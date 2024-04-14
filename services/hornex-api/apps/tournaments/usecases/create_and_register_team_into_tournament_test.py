from datetime import UTC
from datetime import datetime as dt
from unittest.mock import patch

import faker
from django.test import TestCase

from apps.accounts.models import GameID
from apps.tournaments.models import LeagueOfLegendsTournament
from apps.tournaments.usecases import (
    CreateAndRegisterTeamIntoTournamentInput,
    CreateAndRegisterTeamIntoTournamentUseCase,
)
from apps.users.models import User
from lib.challonge import Participant

fake = faker.Faker()


class CreateAndRegisterTeamIntoTournamentUseCaseTest(TestCase):
    @patch("lib.challonge.Tournament.add_team")
    def test_register_team_with_success(self, mock_add_team):
        participant = Participant()
        participant.id = 123
        mock_add_team.return_value = participant

        users = UserSeeder.seed(count=5)
        tournament = TournamentSeeder.create()

        input = CreateAndRegisterTeamIntoTournamentInput(
            user_id=users[0].id,
            tournament_id=tournament.id,
            team_name=fake.name(),
            member_1_email=users[0].email,
            member_2_email=users[1].email,
            member_3_email=users[2].email,
            member_4_email=users[3].email,
            member_5_email=users[4].email,
        )

        output = CreateAndRegisterTeamIntoTournamentUseCase().execute(input)

        self.assertEqual(output.registration.tournament, tournament)
        self.assertIsNotNone(output.registration.challonge_participant_id)

    @patch("lib.challonge.Tournament.add_team")
    def test_register_team_with_challonge_error(self, mock_add_team):
        mock_add_team.side_effect = Exception("Unknown error")

        users = UserSeeder.seed(count=5)
        tournament = TournamentSeeder.create()

        input = CreateAndRegisterTeamIntoTournamentInput(
            user_id=users[0].id,
            tournament_id=tournament.id,
            team_name=fake.name(),
            member_1_email=users[0].email,
            member_2_email=users[1].email,
            member_3_email=users[2].email,
            member_4_email=users[3].email,
            member_5_email=users[4].email,
        )

        with self.assertRaises(Exception) as context:
            CreateAndRegisterTeamIntoTournamentUseCase().execute(input)

            self.assertEqual(
                str(context.exception), "Failed to add participant at challonge"
            )


class UserSeeder:
    @staticmethod
    def seed(count: int = 1, **kwargs) -> list[User]:
        users = []
        for _ in range(count):
            user = User.objects.create_user(
                email=fake.email(),
                password=fake.password(),
                **kwargs,
            )
            users.append(user)
        for user in users:
            GameID.objects.create(
                user=user,
                game=GameID.GameOptions.LEAGUE_OF_LEGENDS,
                nickname=fake.name(),
            )
        return users


class TournamentSeeder:
    @staticmethod
    def create(**kwargs) -> LeagueOfLegendsTournament:
        return LeagueOfLegendsTournament.objects.create(
            name=fake.name(),
            organizer=User.objects.create_user(
                email=fake.email(),
                password=fake.password(),
            ),
            start_date=fake.date_time_this_month(),
            start_time=dt.now(UTC).time(),
            registration_start_date=dt.now(UTC),
            team_size=5,
            max_teams=8,
            **kwargs,
        )

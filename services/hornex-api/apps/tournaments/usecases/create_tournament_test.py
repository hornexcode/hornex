import datetime

from django.test import TestCase

from apps.tournaments.usecases.create_tournament import (
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
)
from apps.users.models import User


class CreateTournamentTestCase(TestCase):
    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

    def test_tournament_created(self):
        params = CreateTournamentUseCaseParams(
            organizer_id=self.user.id,
            game="league-of-legends",
            description="description",
            registration_start_date="2022-01-01",
            registration_end_date="2022-01-03",
            start_date="2022-01-03",
            end_date="2022-01-06",
            start_time="12:00",
            end_time="12:00",
            is_entry_free=True,
            prize_pool_enabled=False,
            open_classification=True,
            size="4",
            team_size="5",
            map_name="map_name",
            prizes=[
                {"place": 1, "is_money": True, "amount": 100, "content": "content 1"},
                {"place": 2, "is_money": True, "amount": 50, "content": "content 2"},
            ],
        )

        result = CreateTournamentUseCase().execute(params)

        self.assertIsNotNone(result.id)
        self.assertEqual(result.organizer, self.user)
        self.assertEqual(result.game, "league-of-legends")
        self.assertEqual(result.description, "description")
        self.assertEqual(result.registration_start_date, "2022-01-01")
        self.assertEqual(result.registration_end_date, "2022-01-03")
        self.assertEqual(result.start_date, "2022-01-03")
        self.assertEqual(result.end_date, "2022-01-06")
        self.assertEqual(result.start_time, "12:00")
        self.assertEqual(result.end_time, "12:00")
        self.assertEqual(result.is_entry_free, True)
        self.assertEqual(result.prize_pool_enabled, True)
        self.assertEqual(result.open_classification, True)
        self.assertEqual(result.size, "size")
        self.assertEqual(result.team_size, "team_size")
        self.assertEqual(result.map_name, "map_name")
        self.assertEqual(result.prizes[0].place, 1)
        self.assertEqual(result.prizes[0].is_money, True)
        self.assertEqual(result.prizes[0].amount, 100)
        self.assertEqual(result.prizes[0].content, "content")

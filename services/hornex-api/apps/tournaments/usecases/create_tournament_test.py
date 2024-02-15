import uuid
from datetime import date, datetime, time
from unittest.mock import patch

from django.test import TestCase
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.tournaments.models import Prize
from apps.tournaments.usecases.create_tournament import (
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
)
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament


class CreateTournamentTestCase(TestCase):
    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.prizes = [
            {"place": 1, "is_money": True, "amount": 100, "content": "content 1"},
            {"place": 2, "is_money": True, "amount": 50, "content": "content 2"},
            {"place": 3, "is_money": False, "amount": 0, "content": "content 3"},
        ]
        self.params = CreateTournamentUseCaseParams(
            game="league-of-legends",
            name="name",
            description="description",
            organizer_id=self.user.id,
            registration_start_date="2022-01-01T00:00:00",
            registration_end_date="2022-01-03T00:00:00",
            check_in_duration="15",
            start_date="2022-01-03",
            end_date="2022-01-06",
            start_time="12:00",
            end_time="12:00",
            is_entry_free=True,
            # entry_fee="0",
            prize_pool_enabled=False,
            open_classification=True,
            size="4",
            team_size="5",
            map_name="map_name",
            prizes=self.prizes,
        )

    @patch("lib.challonge.Tournament.create")
    def test_tournament_created_with_prizes(self, ch_tournament_create_mock):
        ch_tournament_create_mock.return_value = ChallongeTournament.construct_from(
            values={"id": 1, "url": "sample_tournament_1"}
        )

        result = CreateTournamentUseCase().execute(self.params)

        prizes_result = Prize.objects.filter(tournament=result)

        self.assertIsNotNone(result.id)
        self.assertEqual(result.organizer, self.user)
        self.assertEqual(result.game, "league-of-legends")
        self.assertEqual(result.description, "description")
        self.assertEqual(result.registration_start_date, datetime(2022, 1, 1, 0, 0))
        self.assertEqual(result.registration_end_date, datetime(2022, 1, 3, 0, 0))
        self.assertEqual(result.check_in_duration, 15)
        self.assertEqual(result.start_date, date(2022, 1, 3))
        self.assertEqual(result.end_date, date(2022, 1, 6))
        self.assertEqual(result.start_time, time(12, 0))
        self.assertEqual(result.end_time, time(12, 0))
        self.assertEqual(result.is_entry_free, True)
        self.assertEqual(result.prize_pool_enabled, False)
        self.assertEqual(result.open_classification, True)
        self.assertEqual(result.max_teams, 4)
        self.assertEqual(result.team_size, 5)
        self.assertEqual(result.challonge_tournament_id, 1)
        self.assertEqual(
            result.challonge_tournament_url, "https://challonge.com/sample_tournament_1"
        )

        for i, prize in enumerate(prizes_result):
            self.assertEqual(prize.place, self.prizes[i]["place"])
            self.assertEqual(prize.is_money, self.prizes[i]["is_money"])
            self.assertEqual(prize.amount, self.prizes[i]["amount"])
            self.assertEqual(prize.content, self.prizes[i]["content"])

    def test_invalid_user_id(self):
        self.params.organizer_id = uuid.uuid4()

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(e.detail["error"], "User not found")

    def test_invalid_registration_start_date(self):
        self.params.registration_start_date = "2022-01-03T00:00:00"

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                "Registration start date is greater than registration end date",
            )

    def test_invalid_start_date(self):
        self.params.start_date = "2022-01-07"

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Start date is greater than end date")

    def test_registration_greater_than_start_date(self):
        self.params.registration_end_date = "2022-01-07T00:00:00"

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]), "Registration end date is greater than start date"
            )

    def test_challonge_not_created(self):
        with patch("lib.challonge.Tournament.create") as ch_tournament_create_mock:
            ch_tournament_create_mock.return_value = None

            try:
                CreateTournamentUseCase().execute(self.params)
            except Exception as e:
                self.assertEqual(str(e), "Tournament not created at challonge")

    def test_entry_free_and_prize_pool_enabled(self):
        try:
            CreateTournamentUseCaseParams(
                game="league-of-legends",
                name="name",
                description="description",
                organizer_id=self.user.id,
                registration_start_date="2022-01-01T00:00:00",
                registration_end_date="2022-01-03T00:00:00",
                check_in_duration="15",
                start_date="2022-01-03",
                end_date="2022-01-06",
                start_time="12:00",
                end_time="12:00",
                is_entry_free=True,
                entry_fee="0",
                prize_pool_enabled=True,
                open_classification=True,
                size="4",
                team_size="5",
                map_name="map_name",
                prizes=self.prizes,
            )

        except serializers.ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                "Prize pool cannot be enabled when the entry is free",
            )

    def test_invalid_prizes(self):
        try:
            CreateTournamentUseCaseParams(
                game="league-of-legends",
                name="name",
                description="description",
                organizer_id=self.user.id,
                registration_start_date="2022-01-01T00:00:00",
                registration_end_date="2022-01-03T00:00:00",
                check_in_duration="15",
                start_date="2022-01-03",
                end_date="2022-01-06",
                start_time="12:00",
                end_time="12:00",
                is_entry_free=False,
                entry_fee="0",
                prize_pool_enabled=False,
                open_classification=True,
                size="4",
                team_size="5",
                map_name="map_name",
                prizes=[{"place": 1, "is_money": True, "amount": 100, "content": "content 1"}],
            )

        except serializers.ValidationError as e:
            self.assertEqual(
                str(e.detail[0]),
                "Prizes for places 1, 2, and 3 are required.",
            )

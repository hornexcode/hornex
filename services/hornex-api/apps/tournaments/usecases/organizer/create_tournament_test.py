import uuid
from datetime import datetime, timedelta
from unittest.mock import patch

from django.test import TestCase
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.tournaments.models import Prize
from apps.tournaments.usecases.organizer.create_tournament import (
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
            {"place": 1, "is_money": True, "amount": 100, "content": "test-content-1"},
            {"place": 2, "is_money": True, "amount": 50, "content": "test-content-2"},
            {"place": 3, "is_money": False, "amount": 0, "content": "test-content-3"},
        ]

        now = datetime.now()
        start_at = now + timedelta(days=1)
        end_at = start_at + timedelta(days=3)

        self.params = CreateTournamentUseCaseParams(
            game="league-of-legends",
            name="test-tournament",
            description="test-description",
            organizer_id=self.user.id,
            registration_start_date=now.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            start_date=start_at.date().strftime("%Y-%m-%d"),
            end_date=end_at.date().strftime("%Y-%m-%d"),
            start_time=start_at.time().strftime("%H:%M"),
            end_time=end_at.time().strftime("%H:%M"),
            is_entry_free=True,
            entry_fee=0,
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
        self.assertEqual(result.game, self.params.game)
        self.assertEqual(result.description, self.params.description)
        self.assertEqual(
            result.registration_start_date,
            datetime.strptime(self.params.registration_start_date, "%Y-%m-%dT%H:%M:%S.000Z"),
        )
        self.assertEqual(
            result.start_date, datetime.strptime(self.params.start_date, "%Y-%m-%d").date()
        )
        self.assertEqual(
            result.end_date, datetime.strptime(self.params.end_date, "%Y-%m-%d").date()
        )
        self.assertEqual(
            result.start_time, datetime.strptime(self.params.start_time, "%H:%M").time()
        )
        self.assertEqual(result.end_time, datetime.strptime(self.params.end_time, "%H:%M").time())
        self.assertEqual(result.is_entry_free, self.params.is_entry_free)
        self.assertEqual(result.prize_pool_enabled, self.params.prize_pool_enabled)
        self.assertEqual(result.open_classification, self.params.open_classification)
        self.assertEqual(result.max_teams, int(self.params.size))
        self.assertEqual(result.team_size, int(self.params.team_size))
        self.assertEqual(result.challonge_tournament_id, 1)
        self.assertEqual(
            result.challonge_tournament_url, "https://challonge.com/sample_tournament_1"
        )

        for i, prize in enumerate(prizes_result):
            self.assertEqual(prize.place, self.prizes[i]["place"])
            self.assertEqual(prize.is_money, self.prizes[i]["is_money"])
            self.assertEqual(prize.amount, self.prizes[i]["amount"])
            self.assertEqual(prize.content, self.prizes[i]["content"])

    def test_enabled_prize_pool_with_free_entry(self):
        now = datetime.now()
        start_at = now + timedelta(days=1)
        end_at = start_at + timedelta(days=3)

        try:
            self.params = CreateTournamentUseCaseParams(
                game="league-of-legends",
                name="test-tournament",
                description="test-description",
                organizer_id=self.user.id,
                registration_start_date=now.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                start_date=start_at.date().strftime("%Y-%m-%d"),
                end_date=end_at.date().strftime("%Y-%m-%d"),
                start_time=start_at.time().strftime("%H:%M"),
                end_time=end_at.time().strftime("%H:%M"),
                is_entry_free=True,
                entry_fee=0,
                prize_pool_enabled=True,
                open_classification=True,
                size="4",
                team_size="5",
                map_name="map_name",
                prizes=self.prizes,
            )
        except ValidationError as e:
            self.assertEqual(
                e.detail["error"], "Prize pool cannot be enabled when the entry is free"
            )

    def test_invalid_prizes(self):
        now = datetime.now()
        try:
            CreateTournamentUseCaseParams(
                game="league-of-legends",
                name="test-tournament",
                description="test-description",
                organizer_id=self.user.id,
                registration_start_date=now,
                start_date=now.date(),
                end_date=now.date(),
                start_time=now.time(),
                end_time=now.time(),
                is_entry_free=False,
                entry_fee=0,
                prize_pool_enabled=True,
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

    def test_invalid_user_id(self):
        self.params.organizer_id = uuid.uuid4()

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(e.detail["error"], "User not found")

    def test_past_start_date(self):
        self.params.start_date = datetime.now().date().strftime("%Y-%m-%d")

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                "Start date needs to be in the future",
            )

    def test_invalid_registration_start_date(self):
        self.params.registration_start_date = (datetime.now() + timedelta(days=10)).strftime(
            "%Y-%m-%dT%H:%M:%S.000Z"
        )

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(
                e.detail["error"],
                "Registration start date is greater than start date",
            )

    def test_invalid_start_date(self):
        self.params.start_date = (datetime.now() + timedelta(days=10)).date().strftime("%Y-%m-%d")

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Start date is greater than end date")

    def test_invalid_entry_fee(self):
        self.params.is_entry_free = False
        self.params.entry_fee = 0

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Invalid entry fee")

    def test_invalid_prize_amounts(self):
        prizes = [
            {"place": 1, "is_money": True, "content": "test-content-1"},
        ]
        self.params.prize_pool_enabled = False
        self.params.is_entry_free = False
        self.params.entry_fee = 12
        self.params.prizes = prizes

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Invalid amount for #1")

        self.params.prizes = [
            {"place": 1, "is_money": True, "amount": 12, "content": "test-content-1"},
            {"place": 2, "is_money": True, "amount": 0, "content": "test-content-2"},
        ]
        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Invalid amount for #2")

    def test_invalid_prize_content(self):
        prizes = [
            {"place": 1, "is_money": False, "content": ""},
        ]
        self.params.prize_pool_enabled = False
        self.params.is_entry_free = False
        self.params.entry_fee = 12
        self.params.prizes = prizes

        try:
            CreateTournamentUseCase().execute(self.params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "No money prizes must have description")

    def test_challonge_not_created(self):
        with patch("lib.challonge.Tournament.create") as ch_tournament_create_mock:
            ch_tournament_create_mock.return_value = None

            try:
                CreateTournamentUseCase().execute(self.params)
            except Exception as e:
                self.assertEqual(str(e), "Tournament not created at challonge")

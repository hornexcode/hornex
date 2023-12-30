from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td
from unittest.mock import patch

import structlog
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.leagueoflegends.models import Tournament
from apps.teams.models import Team
from apps.tournaments.models import Registration
from apps.users.models import User
from lib.efi.client import Mock as EfiMock

logger = structlog.get_logger(__name__)


class TestPaymentRegistration(
    APITestCase,
):
    def setUp(self) -> None:
        self.credentials = {
            "email": "test.user@hornexcode.com",
            "name": "test-user",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)
        # Authenticate the client with the token

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    @patch("apps.payments.views.get_payment_gateway")
    def test_create_payment_registration_success(self, mock_payment_gateway):
        mock_payment_gateway.return_value = EfiMock()

        now = dt.now(UTC)
        tournament = Tournament.objects.create(
            name="test-name",
            description="test-description",
            entry_fee=100,
            max_teams=1,
            start_date=now + td(days=7),
            end_date=now + td(days=8),
            start_time=now,
            end_time=now + td(hours=1),
            registration_start_date=now,
            registration_end_date=now + td(days=7),
            organizer=self.user,
        )

        team = Team.objects.create(name="test-name", created_by=self.user)

        registration = Registration.objects.create(
            team=team,
            tournament=tournament,
            status=Registration.RegistrationStatusType.PENDING,
        )

        target_url = reverse("create-payment-registration")
        self.assertEqual(1, 1)

        resp = self.client.post(
            target_url,
            {
                "registration": registration.pk,
                "name": "john doe",
                "cpf": "11111111111",
            },
            format="json",
        )

        mock_payment_gateway.assert_called_once()
        self.assertEqual(resp.status_code, 201)

import uuid
from test.factories import (
    GameIdFactory,
    LeagueOfLegendsTournamentFactory,
    RegistrationFactory,
    TeamFactory,
    UserFactory,
)
from unittest.mock import patch

from django.urls import reverse
from rest_framework.test import APITestCase

from apps.payments.models import PaymentRegistration
from apps.tournaments.models import Registration, Tournament


class TestWebhooks(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()
        self.game_id = GameIdFactory.new(user=self.user)
        self.team = TeamFactory.new(created_by=self.user)
        for _ in range(0, 4):
            self.team.add_member(GameIdFactory.new())

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=UserFactory.new(),
        )

        RegistrationFactory.new(
            tournament=self.tournament, team=self.team, challonge_participant_id=123
        )
        self.registration = Registration.objects.create(
            tournament=self.tournament,
            team=self.team,
        )

        self.payment_registration = PaymentRegistration.objects.create(
            registration=self.registration,
            amount=100,
        )

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    def test_efi_callback_success(self, mocked_check_signature, mocked_verify_ip):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        # pass hmac secret to query params
        url = reverse("efi-callback")

        resp = self.client.post(
            url,
            {
                "pix": [
                    {
                        "endToEndId": "E09089356202312302342API9295b711",
                        "txid": self.payment_registration.id.hex,
                        "chave": "5f0d0e75-dde2-473e-ab2f-d9d140f68e62",
                        "valor": "1.00",
                        "horario": "2023-12-30T23:42:18.000Z",
                        "infoPagador": "Teste de pagamento em ambiente sandbox",
                    }
                ]
            },
        )
        self.assertEqual(resp.status_code, 200)
        self.assertDictEqual(
            resp.json(),
            {"message": "Successfully confirmed the payment"},
        )

        self.assertEqual(PaymentRegistration.objects.count(), 1)
        self.assertTrue(PaymentRegistration.objects.first().is_paid())
        self.assertEqual(Registration.objects.count(), 1)
        self.assertEqual(
            Registration.objects.first().status,
            Registration.RegistrationStatusOptions.ACCEPTED,
        )
        self.assertEqual(Tournament.objects.first().teams.count(), 1)

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    def test_efi_callback_empty_payload(self, mocked_check_signature, mocked_verify_ip):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        # pass hmac secret to query params
        url = reverse("efi-callback")

        resp = self.client.post(
            url,
            {},
        )
        self.assertEqual(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(),
            {"message": "Invalid payload"},
        )

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    def test_efi_callback_payment_not_found_error(self, mocked_check_signature, mocked_verify_ip):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        # pass hmac secret to query params
        url = reverse("efi-callback")

        resp = self.client.post(
            url,
            {
                "pix": [
                    {
                        "endToEndId": "E09089356202312302342API9295b711",
                        "txid": uuid.uuid4().hex,
                        "chave": "5f0d0e75-dde2-473e-ab2f-d9d140f68e62",
                        "valor": "2.00",
                        "horario": "2023-12-30T23:42:18.000Z",
                        "infoPagador": "Teste de pagamento em ambiente sandbox",
                    }
                ]
            },
        )
        self.assertEqual(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(),
            {"message": "Payment registration not found"},
        )

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    def test_efi_callback_amount_not_match_error(self, mocked_check_signature, mocked_verify_ip):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        # pass hmac secret to query params
        url = reverse("efi-callback")

        resp = self.client.post(
            url,
            {
                "pix": [
                    {
                        "endToEndId": "E09089356202312302342API9295b711",
                        "txid": self.payment_registration.id.hex,
                        "chave": "5f0d0e75-dde2-473e-ab2f-d9d140f68e62",
                        "valor": "2.00",
                        "horario": "2023-12-30T23:42:18.000Z",
                        "infoPagador": "Teste de pagamento em ambiente sandbox",
                    }
                ]
            },
        )
        self.assertEqual(resp.status_code, 400)
        self.assertDictEqual(
            resp.json(),
            {"message": "Amount paid does not match with current registration amount"},
        )

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    @patch("apps.payments.models.PaymentRegistration.confirm_payment")
    def test_efi_callback_confirm_payment_fail(
        self, mocked_confirm_payment, mocked_check_signature, mocked_verify_ip
    ):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        with mocked_confirm_payment:
            mocked_confirm_payment.side_effect = Exception("error saving payment")

            # pass hmac secret to query params
            url = reverse("efi-callback")

            resp = self.client.post(
                url,
                {
                    "pix": [
                        {
                            "endToEndId": "E09089356202312302342API9295b711",
                            "txid": self.payment_registration.id.hex,
                            "chave": "5f0d0e75-dde2-473e-ab2f-d9d140f68e62",
                            "valor": "1.00",
                            "horario": "2023-12-30T23:42:18.000Z",
                            "infoPagador": "Teste de pagamento em ambiente sandbox",
                        }
                    ]
                },
            )
            self.assertEqual(resp.status_code, 500)
            self.assertDictEqual(
                resp.json(),
                {"message": "Something went wrong while confirming the payment"},
            )

    @patch("apps.webhooks.decorators.is_ip_authorized")
    @patch("apps.webhooks.decorators.check_signature")
    @patch("apps.tournaments.models.Registration.confirm_registration")
    def test_efi_callback_confirm_registration_fail(
        self,
        mocked_confirm_registration,
        mocked_check_signature,
        mocked_verify_ip,
    ):
        mocked_check_signature.return_value = True
        mocked_verify_ip.return_value = True

        with mocked_confirm_registration:
            mocked_confirm_registration.side_effect = Exception("error saving registration")

            # pass hmac secret to query params
            url = reverse("efi-callback")

            resp = self.client.post(
                url,
                {
                    "pix": [
                        {
                            "endToEndId": "E09089356202312302342API9295b711",
                            "txid": self.payment_registration.id.hex,
                            "chave": "5f0d0e75-dde2-473e-ab2f-d9d140f68e62",
                            "valor": "1.00",
                            "horario": "2023-12-30T23:42:18.000Z",
                            "infoPagador": "Teste de pagamento em ambiente sandbox",
                        }
                    ]
                },
            )

            self.assertEqual(resp.status_code, 500)
            self.assertDictEqual(
                resp.json(),
                {"message": "Something went wrong while confirming the registration"},
            )

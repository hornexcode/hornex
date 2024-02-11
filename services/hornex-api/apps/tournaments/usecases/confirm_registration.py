# Description: Register a team in a tournament

import structlog
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.payments.models import PaymentRegistration
from apps.tournaments.models import Registration
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


class ConfirmRegistrationUseCaseParams:
    registration_id: str

    def __init__(self, **kwargs):
        self.validate(**kwargs)
        self.registration_id = kwargs.get("registration_id")

    class Validator(serializers.Serializer):
        registration_id = serializers.UUIDField()

    def validate(self, **kwargs):
        params = self.Validator(data=kwargs)
        params.is_valid(raise_exception=True)


class ConfirmRegistrationUseCase:
    """
    Confirm a team in a tournament
    """

    # def __init__(self, tournament_repository, team_repository):
    #     self.tournament_repository = tournament_repository
    #     self.team_repository = team_repository

    @transaction.atomic
    def execute(self, params: ConfirmRegistrationUseCaseParams) -> Registration:
        try:
            payment_registration = PaymentRegistration.objects.get(id=params.registration_id)
        except PaymentRegistration.DoesNotExist:
            logger.error(
                "PaymentRegistration.DoesNotExist",
                registration_id=params.registration_id,
            )
            raise ValidationError(
                {"detail": "Payment registration not found"},
            )

        payment_registration.confirm_payment()
        registration = payment_registration.registration
        registration.confirm_registration()

        try:
            ChallongeTournament.add_team(
                registration.tournament.challonge_tournament_id,
                registration.team.name,
            )
        except Exception as e:
            logger.error(
                "ChallongeTournament.add_participant",
                registration_id=registration.id,
                exception=e,
            )
            raise ValidationError(
                {"detail": "Error adding participant to Challonge"},
            )

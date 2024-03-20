import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Registration

logger = structlog.get_logger(__name__)


@dataclass
class CancelRegistrationInput:
    registration_id: uuid.UUID
    user_id: uuid.UUID


@dataclass
class CancelRegistrationUseCase:
    @transaction.atomic
    def execute(self, params: CancelRegistrationInput):
        registration = get_object_or_404(Registration, id=params.registration_id)
        members = registration.team.members.all()

        if not any(member.user.id == params.user_id for member in members):
            raise PermissionDenied({"error": "You are not a team member"})

        if registration.tournament.status != Tournament.StatusOptions.REGISTERING:
            raise ValidationError(
                {
                    "error": "You can not cancel a registration when the tournament is not running"
                }
            )

        if datetime.now() > registration.created_at + timedelta(days=1):
            raise ValidationError(
                {"error": "You can not cancel a registration with more than 24 hour"}
            )

        registration.delete()

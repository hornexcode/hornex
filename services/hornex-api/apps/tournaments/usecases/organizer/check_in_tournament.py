import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class CheckInTournamentInput:
    tournament_uuid: uuid.UUID
    organizer_id: uuid.UUID


@dataclass
class CheckInTournamentOutput:
    None


@dataclass
class CheckInTournamentUseCase:
    @transaction.atomic
    def execute(self, params: CheckInTournamentInput) -> CheckInTournamentOutput:
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)
        organizer = get_object_or_404(User, id=params.organizer_id)

        if organizer != tournament.organizer:
            raise PermissionDenied({"error": "You are not this tournament's Organizer"})

        check_in_end_at = datetime.combine(tournament.start_date, tournament.start_time)
        check_in_start_at = check_in_end_at - timedelta(minutes=tournament.check_in_duration)

        if not (check_in_start_at < datetime.now() < check_in_end_at):
            raise ValidationError(
                {"error": "You can not check-in a tournament out check-in window"}
            )

        try:
            ChallongeTournament.checkin(tournament=tournament.challonge_tournament_id)
        except Exception:
            raise Exception("Failed to process tournament check-in at Challonge")

        tournament.checked_in = True
        tournament.save()

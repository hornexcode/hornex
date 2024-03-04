import uuid
from dataclasses import dataclass
from datetime import datetime

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class EndTournamentInput:
    tournament_uuid: uuid.UUID
    user_id: uuid.UUID


@dataclass
class EndTournamentUseCase:
    @transaction.atomic
    def execute(self, params: EndTournamentInput) -> Tournament:
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)

        if params.user_id != tournament.organizer.id:
            raise ValidationError({"error": "You are not this tournament's Organizer"})

        if tournament.status != Tournament.StatusOptions.RUNNING or tournament.ended_at:
            raise ValidationError({"error": "You can not end a tournament which are not running"})

        try:
            ChallongeTournament.finalize(tournament=tournament.challonge_tournament_id)
        except Exception:
            raise Exception("Failed end tournament at Challonge")

        tournament.status = Tournament.StatusOptions.ENDED
        tournament.ended_at = datetime.now()
        tournament.save()
        tournament.refresh_from_db()

        return tournament

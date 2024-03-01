import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match
from apps.users.models import User
from lib.challonge import Match as ChallongeMatch

logger = structlog.get_logger(__name__)


@dataclass
class StartMatchInput:
    tournament_uuid: uuid.UUID
    match_uuid: uuid.UUID
    organizer_id: uuid.UUID


@dataclass
class StartMatchOutput:
    None


@dataclass
class StartMatchUseCase:
    @transaction.atomic
    def execute(self, params: StartMatchInput) -> StartMatchOutput:
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)
        organizer = get_object_or_404(User, id=params.organizer_id)

        if organizer != tournament.organizer:
            raise ValidationError({"error": "You are not this tournament's Organizer"})

        match = get_object_or_404(Match, uuid=params.match_uuid)

        try:
            ChallongeMatch.mark_as_underway(
                tournament=tournament.challonge_tournament_id, match=match.challonge_match_id
            )
        except Exception:
            raise Exception("Failed mark match as under_way at Challonge")

        match.status = Match.StatusType.UNDERWAY
        match.save()

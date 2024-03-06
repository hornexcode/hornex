import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match
from lib.challonge import Match as ChallongeMatch

logger = structlog.get_logger(__name__)


@dataclass
class StartMatchInput:
    tournament_id: uuid.UUID
    match_id: uuid.UUID
    user_id: uuid.UUID


@dataclass
class StartMatchUseCase:
    @transaction.atomic
    def execute(self, params: StartMatchInput):
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        if tournament.organizer.id != params.user_id:
            raise PermissionDenied({"error": "You are not this tournament's Organizer"})

        match = get_object_or_404(Match, id=params.match_id)

        try:
            ChallongeMatch.mark_as_underway(
                tournament=tournament.challonge_tournament_id, match=match.challonge_match_id
            )
        except Exception:
            raise Exception("Failed mark match as under_way at Challonge")

        match.status = Match.StatusType.UNDERWAY
        match.save()
        return match

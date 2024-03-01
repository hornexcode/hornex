import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match, Registration
from lib.challonge import Match as ChallongeMatch

logger = structlog.get_logger(__name__)


@dataclass
class FinishMatchInput:
    tournament_uuid: uuid.UUID
    match_uuid: uuid.UUID
    user_id: uuid.UUID
    winner_id: uuid.UUID


@dataclass
class FinishMatchUseCase:
    @transaction.atomic
    def execute(self, params: FinishMatchInput):
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)

        if params.user_id != tournament.organizer.id:
            raise ValidationError({"error": "You are not this tournament's Organizer"})

        match = get_object_or_404(Match, uuid=params.match_uuid)
        winner = get_object_or_404(Team, id=params.winner_id)

        if match.team_a != winner and match.team_b != winner:
            raise ValidationError({"error": f"Team {winner.name} does not belong to this match"})

        ch_winner: Registration = winner.registration_set.filter(tournament=tournament).first()
        if not ch_winner:
            raise ValidationError({"error": f"Team {winner.name} not registered at tournament"})

        scores_csv = "1-0" if match.team_a == winner else "0-1"

        try:
            ch_match: ChallongeMatch = ChallongeMatch.update(
                tournament=tournament.challonge_tournament_id,
                match=match.challonge_match_id,
                winner_id=ch_winner.challonge_participant_id,
                scores_csv=scores_csv,
            )
        except Exception:
            raise Exception("Failed finish match at Challonge")

        if ch_match.state != "complete":
            raise Exception("We couldn't finish the match")

        match.set_winner(winner)

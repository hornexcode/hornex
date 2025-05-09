import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import ValidationError

from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match, Registration
from lib.challonge import Match as ChallongeMatch

logger = structlog.get_logger(__name__)


@dataclass
class EndMatchInput:
    tournament_id: uuid.UUID
    match_id: uuid.UUID
    user_id: uuid.UUID


@dataclass
class EndMatchUseCase:
    @transaction.atomic
    def execute(self, params: EndMatchInput):
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        if params.user_id != tournament.organizer.id:
            raise PermissionDenied({"error": "You are not this tournament's Organizer"})

        match = get_object_or_404(Match, id=params.match_id)

        if match.team_a_score == match.team_b_score:
            raise ValidationError({"error": "Match is not finished yet"})

        winner = (
            match.team_a if match.team_a_score > match.team_b_score else match.team_b
        )

        ch_winner: Registration = winner.registration_set.filter(
            tournament=tournament
        ).first()

        scores_csv = f"{match.team_a_score}-{match.team_b_score}"
        try:
            ch_match: ChallongeMatch = ChallongeMatch.update(
                tournament=tournament.challonge_tournament_id,
                match=match.challonge_match_id,
                winner_id=ch_winner.challonge_participant_id,
                scores_csv=scores_csv,
            )
        except Exception:
            raise Exception("Failed finish match at Challonge")

        match.set_winner(winner)

        if tournament.is_last_round():
            return match

        ch_matches = ChallongeMatch.list(
            tournament.challonge_tournament_id, ch_match.winner_id, "open"
        )

        for cm in ch_matches:
            # if match has been already created
            if not Match.objects.filter(challonge_match_id=cm.id).exists():
                Match.objects.create(
                    team_a=Team.objects.get(
                        registration__challonge_participant_id=cm.player1_id
                    ),
                    team_b=Team.objects.get(
                        registration__challonge_participant_id=cm.player2_id
                    ),
                    tournament=tournament,
                    challonge_match_id=cm.id,
                    round=cm.round,
                    status=Match.StatusType.NOT_STARTED,
                )

        return match

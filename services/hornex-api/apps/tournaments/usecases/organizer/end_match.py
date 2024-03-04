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
    tournament_uuid: uuid.UUID
    match_uuid: uuid.UUID
    user_id: uuid.UUID


@dataclass
class EndMatchUseCase:
    @transaction.atomic
    def execute(self, params: EndMatchInput):
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)

        if params.user_id != tournament.organizer.id:
            raise PermissionDenied({"error": "You are not this tournament's Organizer"})

        match = get_object_or_404(Match, uuid=params.match_uuid)

        if match.team_a_score == match.team_b_score:
            raise ValidationError({"error": "Match is not finished yet"})

        winner = None
        if match.team_a_score > match.team_b_score:
            winner = match.team_a
        else:
            winner = match.team_b

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
            logger.info("Match finished", match=ch_match)
        except Exception:
            raise Exception("Failed finish match at Challonge")

        match.set_winner(winner)

        # finish match
        # ...

        # create next matches
        if ch_match.winner_id is None:
            raise Exception("Challonge match winner_id is None after update")

        ch_matches = ChallongeMatch.list(
            tournament.challonge_tournament_id, ch_match.winner_id, "open"
        )
        logger.info("Next matches at Challonge", matches=ch_matches)
        if len(ch_matches) == 0:
            return match

        # we must have only one matches here
        if len(ch_matches) > 1:
            raise Exception("Error creating next match, more than one match found at Challonge")

        cm = ch_matches[0]
        Match.objects.create(
            team_a=Team.objects.get(registration__challonge_participant_id=cm.player1_id),
            team_b=Team.objects.get(registration__challonge_participant_id=cm.player2_id),
            tournament=tournament,
            challonge_match_id=cm.id,
            round=cm.round,
            status=Match.StatusType.NOT_STARTED,
        )

        return match

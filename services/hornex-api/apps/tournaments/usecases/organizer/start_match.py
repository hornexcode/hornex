import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match
from lib.challonge import Match as ChallongeMatch
from lib.riot import Tournament as RiotTournamentResourceAPI

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

        players_team_a = [member.puuid for member in match.team_a.members.all()]
        players_team_b = [member.puuid for member in match.team_b.members.all()]

        try:
            codes = RiotTournamentResourceAPI.create_tournament_codes(
                tournament_id=tournament.riot_tournament_id,
                count=1,
                allowedParticipants=[*players_team_a, *players_team_b],
                enoughPlayers=True,
                mapType=tournament.map,
                metadata=tournament.name,
                pickType=tournament.pick,
                spectatorType=tournament.spectator,
                teamSize=tournament.team_size,
            )
        except Exception:
            raise Exception("Temporary error, could not create the league of legends match code")

        match.status = Match.StatusType.UNDERWAY
        match.riot_match_id = codes[0]
        match.save()
        return match

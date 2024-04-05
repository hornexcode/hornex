import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException, PermissionDenied, ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match
from lib.challonge import Match as ChallongeMatch
from lib.mailer import send_match_code_email
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
                tournament=tournament.challonge_tournament_id,
                match=match.challonge_match_id,
            )
        except Exception:
            raise Exception("Failed mark match as under_way at Challonge")

        participants = []
        players_emails = []

        for gameid in [*match.team_a.members.all(), *match.team_b.members.all()]:
            puuid = gameid.get_puuid()
            if puuid == "":
                raise ValidationError(
                    {
                        "detail": f"Player {gameid.nickname} does not have a game id connected to the league of legends."
                    }
                )
            participants.append(puuid)
            players_emails.append(gameid.user.email)

        try:
            codes = RiotTournamentResourceAPI.create_tournament_codes(
                tournament_id=tournament.riot_tournament_id,
                count=1,
                allowed_participants=participants,
                enough_players=True,
                map_type=tournament.map,
                metadata=tournament.name,
                pick_type=tournament.pick,
                spectator_type=tournament.spectator,
                team_size=tournament.team_size,
            )
        except Exception as e:
            logger.info("error requesting tournament codes", error=e)
            raise APIException(
                {
                    "detail": "Failed to create a tournament code at Riot. Please try again later."
                }
            )

        try:
            send_match_code_email(
                to=players_emails,
                team_a=match.team_a.name,
                team_b=match.team_b.name,
                code=codes[0],
            )
        except Exception as e:
            logger.info("Failed to email match's players", error=e)

        match.status = Match.StatusType.UNDERWAY
        match.riot_match_code = codes[0]
        match.save()
        return match

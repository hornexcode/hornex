import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied, ValidationError

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

        for member in [*match.team_a.members.all(), *match.team_b.members.all()]:
            puuid = member.get_puuid()
            if puuid == "":
                raise ValidationError(
                    {
                        "detail": f"Player {member.nickname} disconnected his Riot account. Please, contact him to reconnect it."
                    }
                )
            participants.append(puuid)
            players_emails.append(member.user.email)

        try:
            codes = RiotTournamentResourceAPI.create_tournament_codes(
                tournament_id=tournament.riot_tournament_id,
                count=1,
                allowedParticipants=participants,
                enoughPlayers=True,
                mapType=tournament.map,
                metadata=tournament.name,
                pickType=tournament.pick,
                spectatorType=tournament.spectator,
                teamSize=tournament.team_size,
            )
        except Exception:
            raise Exception(
                "Temporary error, could not create the league of legends match code"
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

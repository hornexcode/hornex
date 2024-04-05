# Description: Register a team in a tournament

from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.tournaments.models import LeagueOfLegendsTournament, Match, Rank, Registration
from lib.challonge import Match as ChallongeMatch
from lib.challonge import Tournament as ChallongeTournament
from lib.riot import Tournament as RiotTournamentResourceAPI

logger = structlog.get_logger(__name__)


@dataclass(frozen=True)
class StartTournamentUseCaseParams:
    id: str


class StartTournamentUseCase:
    @transaction.atomic
    def execute(
        self, params: StartTournamentUseCaseParams
    ) -> LeagueOfLegendsTournament:
        tournament = get_object_or_404(LeagueOfLegendsTournament, id=params.id)

        tournament.start()

        # Challonge
        ChallongeTournament.start(tournament=tournament.challonge_tournament_id)
        ch_matches = ChallongeMatch.list(tournament=tournament.challonge_tournament_id)

        hx_matches = []
        for match in ch_matches:
            if match.round == 1:
                team_a = Registration.objects.get(
                    challonge_participant_id=match.player1_id
                ).team
                team_b = Registration.objects.get(
                    challonge_participant_id=match.player2_id
                ).team

                hx_match = Match.objects.create(
                    tournament=tournament,
                    round=match.round,
                    team_a=team_a,
                    team_b=team_b,
                    challonge_match_id=match.id,
                    status=Match.StatusType.NOT_STARTED,
                )
                hx_matches.append(hx_match)

        for team in tournament.registered_teams.all():
            Rank.objects.create(
                tournament=tournament,
                team=team,
                score=0,
            )

        riot_tournament_id = RiotTournamentResourceAPI.create(
            name=tournament.name, provider_id=tournament.riot_provider_id
        )
        tournament.riot_tournament_id = riot_tournament_id
        tournament.save()
        return tournament

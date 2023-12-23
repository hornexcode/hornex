from django.db import transaction
from requests import RequestException

from apps.tournaments.leagueoflegends.models import Code, LeagueOfLegendsTournament
from apps.tournaments.models import Match, Tournament
from lib.logging import logger
from lib.riot.client import Clientable
from lib.riot.types import (
    CreateTournamentCode,
    MapType,
    PickType,
    SpectatorType,
)
from utils.math import is_power_of_two


class CreateTournamentCodesUseCase:
    def __init__(self, api: Clientable):
        self.api: Clientable = api()

    @transaction.atomic
    def execute(
        self, riot_tournament_id: int, tournament: LeagueOfLegendsTournament
    ) -> None:
        try:
            matches = Match.objects.filter(
                tournament=tournament,
                winner_id__isnull=True,
                status=Match.StatusType.FUTURE,
            )
            matches_count = matches.count()

            if not is_power_of_two(matches_count):
                logger.warning("Tournament future matches are not power of two.")
                raise Exception("Tournament future matches are not power of two.")

            for match in matches:
                team_a = match.team_a
                team_b = match.team_b

                team_a._has_enough_members(tournament.team_size)
                team_b._has_enough_members(tournament.team_size)

                players = [*team_a.members.all(), *team_b.members.all()]

            puuids = [
                user.get_game_account(Tournament.GameType.LEAGUE_OF_LEGENDS).puuid
                for user in players
            ]

            codes = self.api.create_tournament_code(
                CreateTournamentCode(
                    tournament_id=riot_tournament_id,
                    count=matches_count,
                    allowedParticipants=puuids,
                    metadata=tournament.description,
                    teamSize=tournament.team_size,
                    pickType=PickType(tournament.pick),
                    mapType=MapType(tournament.map),
                    spectatorType=SpectatorType(tournament.spectator),
                    enoughPlayers=True,
                )
            )

            for i, code in enumerate(codes):
                Code.objects.create(code=code, tournament=tournament, match=matches[i])

        except RequestException as e:
            logger.warning(e)  # Connection Error, 404, 500, etc
            raise e
        except Exception as e:
            logger.warning(e)  # Unkown error
            raise e

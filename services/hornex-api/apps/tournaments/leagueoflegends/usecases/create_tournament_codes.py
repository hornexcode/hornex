# https://developer.riotgames.com/docs/lol#tournament-api_best-practices
from lib.riot.client import Clientable, CreateTournamentCode
from requests import RequestException
from apps.tournaments.leagueoflegends.models import Code
from lib.logging import logger
from apps.tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournamentProvider,
    LeagueOfLegendsTournament,
)
from apps.tournaments.models import Match


class CreateTournamentCodesUseCase:
    def __init__(self, api: Clientable):
        self.api: Clientable = api()

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
            codes = self.api.create_tournament_code(
                CreateTournamentCode(
                    tournament_id=riot_tournament_id,
                    count=matches_count,
                    allowedParticipants=[
                        "OxC7Ddyh8gdhnc24FbEaS3UbCCvEvdneOiKpzLeBADyY_aHvkRvt8ZL0e5sfZaoLaJUN0TmmsgvuRA"
                        for match in range(matches_count * 5 * 2)
                    ],
                    metadata=tournament.description,
                    teamSize=tournament.team_size,
                    pickType=tournament.pick,
                    mapType=tournament.map,
                    spectatorType=tournament.spectator,
                    enoughPlayers=True,
                )
            )

            for i, code in enumerate(codes):
                Code.objects.create(code=code, tournament=tournament, match=matches[i])

        except RequestException as e:
            logger.warning(e)  # Connection Error, 404, 500, etc
            return
        except Exception as e:
            logger.warning(e)  # Unkown error
            return

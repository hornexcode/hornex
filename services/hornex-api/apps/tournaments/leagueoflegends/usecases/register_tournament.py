# https://developer.riotgames.com/docs/lol#tournament-api_best-practices
from lib.riot.client import Clientable
from requests import RequestException
from lib.logging import logger
from apps.tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
)


class RegisterTournamentUseCase:
    def __init__(self, api: Clientable):
        self.api: Clientable = api()

    def execute(self, tournament: LeagueOfLegendsTournament) -> int:
        try:
            riot_tournament_id = self.api.register_tournament(
                tournament.name, tournament.provider.id
            )

            tournament.riot_id = riot_tournament_id
            tournament.save()

            return riot_tournament_id

        except RequestException as e:
            logger.warning(e)  # Connection Error, 404, 500, etc
            return
        except Exception as e:
            logger.warning(e)  # Unkown error
            return

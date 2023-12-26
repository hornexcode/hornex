from requests import RequestException

from apps.leagueoflegends.models import (
    Tournament,
)
from lib.logging import logger
from lib.riot.client import Clientable


class GetOrRegisterLeagueOfLegendsTournamentUseCase:
    def __init__(self, api: Clientable):
        self.api: Clientable = api()

    def execute(self, tournament: Tournament) -> int:
        try:
            if tournament.riot_id:
                return tournament.riot_id

            riot_tournament_id = self.api.register_tournament(
                tournament.name, tournament.provider.id
            )

            tournament.riot_id = riot_tournament_id
            tournament.save()

            return riot_tournament_id

        except RequestException as e:
            logger.warning(e)
            raise e
        except Exception as e:
            logger.warning(e)
            raise e

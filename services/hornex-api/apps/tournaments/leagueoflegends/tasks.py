from celery import shared_task
from lib.hornex.riot import getApi
from apps.tournaments.leagueoflegends.usecases import RegisterTournamentProviderUseCase
from apps.tournaments.events import TournamentCreated

client = getApi("keytest")


@shared_task(
    name="tournaments.leagueoflegends.tasks.register_tournament",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def register_tournament(self, event):
    """
    Register a tournament for a game
    Will call the right game provider api to register the tournament
    :param tournament_id: ID of the tournament to register
    """
    try:
        uc = RegisterTournamentProviderUseCase(client)

        # if error retry will run again
        data = TournamentCreated.from_message(event)
        uc.execute(name=data.name, region="BR")
    except Exception:
        raise self.retry()

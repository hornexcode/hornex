from celery import shared_task
from lib.hornex.riot import getApi
from apps.tournaments.leagueoflegends.usecases import (
    RegisterTournamentProviderUseCase,
    RegisterTournamentUseCase,
    CreateTournamentCodesUseCase,
)
from apps.tournaments.events import TournamentCreated
from lib.riot.client import Client
from apps.tournaments.leagueoflegends.models import LeagueOfLegendsTournament

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


@shared_task(
    name="tournaments.leagueoflegends.tasks.on_brackets_generated",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def on_brackets_generated(self, tournament_id: str):
    """
    Generate tournament code from tournament Id
    """
    try:
        tournament = LeagueOfLegendsTournament.objects.get(id=tournament_id)

        registerTournamentUseCase = RegisterTournamentUseCase(Client)
        createTournamentCodesUseCase = CreateTournamentCodesUseCase(Client)

        riot_tournament_id = registerTournamentUseCase.execute(tournament)
        createTournamentCodesUseCase.execute(riot_tournament_id, tournament)
    except Exception as e:
        raise self.retry()

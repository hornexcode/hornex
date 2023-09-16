from celery import shared_task
from lib.hornex.riot import TestApi
from tournaments.leagueoflegends.usecases import RegisterTeam
from tournaments.events import TournamentRegistrationConfirmed


@shared_task(
    name="tournaments.leagueoflegends.tasks.register_tournament_for_game",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def register_tournament_for_game(self, event):
    """
    Register a tournament for a game
    Will call the right game provider api to register the tournament
    :param tournament_id: ID of the tournament to register
    """
    api = TestApi()
    uc = RegisterTeam(api)

    # if error retry will run again
    data = TournamentRegistrationConfirmed.from_message(event)
    uc.execute()


@shared_task(
    name="tournaments.leagueoflegends.tasks.register_tournament_for_game",
    bind=True,
    max_retries=3,
    default_retry_delay=30,
)
def register_team_for_tournament():
    """
    Register a team for a tournament
    Will call the right game provider api to register the team into a tournament
    :param team_id: ID of the team to register
    :param tournament_id: ID of the tournament to register for
    """
    pass

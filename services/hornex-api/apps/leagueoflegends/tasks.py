from core.celery import app
from lib.challonge import Tournament


@app.task
def check_in_challonge_participant(
    challonge_tournament_id: str, tournament_id: str, team_id: str
):
    participants = Tournament.list_participants(challonge_tournament_id)

    Tournament.checkin_participant(challonge_tournament_id, participant=team_id)

    def find_participant():
        for participant in participants:
            if participant["name"] == team_id:
                return participant

from dataclasses import dataclass
from typing import TypedDict, Unpack

import structlog

from apps.leagueoflegends.models import Tournament
from lib.challonge import Tournament as ChallongeTournamentAPIResource

logger = structlog.get_logger(__name__)


@dataclass(frozen=True)
class ParticipantRegisteredTask:
    user_id: str
    team_id: str
    tournament_id: str

    class Input(TypedDict):
        user_id: str
        team_id: str
        tournament_id: str

    def execute(self):
        try:
            logger.info("Handling participant registered event")

            tournament = Tournament.objects.get(id=self.tournament_id)

            participants = ChallongeTournamentAPIResource.list_participants(
                tournament.challonge_tournament_id
            )

            logger.info("Participants", participants=participants)

            # ChallongeTournamentAPIResource.checkin_participant()
        except Exception as e:
            logger.warn(
                "Failed to handle participant registered event with error: ",
                error=e,
            )


def participant_registered_task(data: ParticipantRegisteredTask.Input):
    try:
        event = ParticipantRegisteredTask(**data)
        event.execute()
    except TypeError:
        logger.warn(
            "participant_registered_task.ParticipantRegisteredTask: invalid data",
            data=data,
        )


def participant_registered(**params: Unpack["ParticipantRegisteredTask.Input"]):
    logger.debug("Participant registered", params=params)
    participant_registered_task(params)

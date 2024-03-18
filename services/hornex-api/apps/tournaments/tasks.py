from dataclasses import dataclass
from datetime import datetime as dt
from typing import TypedDict, Unpack

import structlog

from apps.tournaments.models import Tournament
from core.experiments import experimental
from lib.challonge import Participant as ChallongeParticipantAPIResource
from lib.challonge import Tournament as TournamentAPIResource

logger = structlog.get_logger(__name__)


# Create Challonge Tournament...
@dataclass(frozen=True)
class CreateTournamentTask:
    tournament_id: str

    class Input(TypedDict):
        tournament_id: str

    def execute(self):
        try:
            logger.info(
                "Handling create tournament task...",
                tournament_id=self.tournament_id,
            )
            tournament = Tournament.objects.get(id=self.tournament_id)

            start_at = dt.combine(tournament.start_date, tournament.start_time)
            start_at_str = start_at.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")

            resp = TournamentAPIResource.create(
                name=tournament.name,
                tournament_type="single elimination",
                start_at=start_at_str,
                teams=True,
                check_in_duration=tournament.check_in_duration,
            )

            tournament.challonge_tournament_id = resp["tournament"]["id"]
            tournament.save()

            logger.info(
                "Challonge tournament created",
                tournament_id=tournament.challonge_tournament_id,
            )
        except Exception as e:
            logger.error("CreateTournamentTask.execute failed", error=e)


def _create_challonge_tournament_task(data: CreateTournamentTask.Input):
    try:
        task = CreateTournamentTask(**data)
        task.execute()
    except TypeError:
        # TODO: use dead letter queue
        logger.error(
            "create_tournament_task.CreateTournamentTask: invalid data",
            data=data,
        )


@experimental
def create_challonge_tournament(**params: Unpack["CreateTournamentTask.Input"]):
    _create_challonge_tournament_task(params)


# Start Challonge Tournament...
def start_tournament(*args, **kwargs):
    logger.info("Starting tournament....", args=args, kwargs=kwargs)


# Check in Challonge Team...
@dataclass(frozen=True)
class CreateCheckInTask:
    challonge_tournament_id: str
    team_id: str

    class Input(TypedDict):
        challonge_tournament_id: str
        team_id: str

    def execute(self):
        try:
            participants = TournamentAPIResource.list_participants(
                self.challonge_tournament_id
            )

            logger.info("Participants", participants=participants)

            result = next(
                filter(
                    lambda participant: participant.misc == self.team_id,
                    participants,
                ),
                None,
            )

            logger.info("Result", result=result)

            if not result:
                logger.warn("Team not found", team=self.team_id)
                raise Exception("Team not found")

            TournamentAPIResource.checkin_participant(
                self.challonge_tournament_id, result.id
            )

        except Exception as e:
            logger.warn("Failed to handle checkin team event with error: ", error=e)


def _checkin_team_task(data: CreateCheckInTask.Input):
    try:
        task = CreateCheckInTask(**data)
        task.execute()
    except TypeError:
        logger.warn("checkin_team_task.CreateCheckInTask: invalid data", data=data)


def challonge_tournament_team_checkin_create(
    **params: Unpack["CreateCheckInTask.Input"],
):
    logger.debug("Creating checking at Challonge...", params=params)
    _checkin_team_task(params)


# Create Challonge participant...
@dataclass(frozen=True)
class CreateParticipantTask:
    challonge_tournament_id: str
    team_id: str
    team_name: str

    class Input(TypedDict):
        challonge_tournament_id: str
        team_id: str
        team_name: str

    def execute(self):
        try:
            logger.info(
                "Handling create participant task...",
                challonge_tournament_id=self.challonge_tournament_id,
                team_id=self.team_id,
                team_name=self.team_name,
            )

            resp = ChallongeParticipantAPIResource.create(
                tournament=self.challonge_tournament_id,
                name=self.team_name,
                misc=self.team_id,
            )

            logger.info(
                "Challonge participant created",
                participant_id=resp["participant"]["id"],
            )
        except Exception as e:
            logger.error("CreateParticipantTask.execute failed", error=e)


def _create_challonge_participant_task(data: CreateParticipantTask.Input):
    try:
        task = CreateParticipantTask(**data)
        task.execute()
    except TypeError:
        # TODO: use dead letter queue
        logger.error(
            "create_participant_task.CreateParticipantTask: invalid data",
            data=data,
        )


def create_challonge_participant(
    **params: Unpack["CreateParticipantTask.Input"],
):
    logger.debug("Create participant", params=params)
    _create_challonge_participant_task(params)

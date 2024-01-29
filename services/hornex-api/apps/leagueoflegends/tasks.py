from dataclasses import dataclass
from datetime import datetime as dt
from typing import TypedDict, Unpack

import pytz
import structlog
from celery import shared_task

from apps.leagueoflegends.models import Tournament
from lib.challonge import Tournament as ChallongeTournamentAPIResource

logger = structlog.get_logger(__name__)


@dataclass(frozen=True)
class ParticipantRegisteredEvent:
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
                "Failed to handle participant registered event with error: ", error=e
            )


@shared_task
def participant_registered_task(data: ParticipantRegisteredEvent.Input):
    try:
        event = ParticipantRegisteredEvent(**data)
        event.execute()
    except TypeError:
        logger.warn(
            "participant_registered_task.ParticipantRegisteredEvent: invalid data",
            data=data,
        )


def participant_registered(**params: Unpack["ParticipantRegisteredEvent.Input"]):
    logger.debug("Participant registered", params=params)
    participant_registered_task.delay(params)


@dataclass(frozen=True)
class CreateTournamentEvent:
    tournament_id: str

    class Input(TypedDict):
        tournament_id: str

    def execute(self):
        try:
            logger.info("Handling create tournament event")
            tournament = Tournament.objects.get(id=self.tournament_id)

            start_at = dt.combine(tournament.start_date, tournament.start_time)
            start_at_utc = start_at.replace(tzinfo=pytz.UTC)
            start_at_str = start_at_utc.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")

            resp = ChallongeTournamentAPIResource.create(
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
            logger.warn("Failed to handle start tournament event with error: ", error=e)


@shared_task
def create_tournament_task(data: CreateTournamentEvent.Input):
    try:
        event = CreateTournamentEvent(**data)
        event.execute()
    except TypeError:
        logger.warn(
            "create_tournament_task.CreateTournamentEvent: invalid data", data=data
        )


def create_tournament(**params: Unpack["CreateTournamentEvent.Input"]):
    logger.debug("Create tournament", params=params)
    create_tournament_task.delay(params)

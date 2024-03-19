from collections import defaultdict
from dataclasses import dataclass

from django.shortcuts import get_object_or_404

from apps.tournaments.models import Participant, Tournament


@dataclass
class ListRegisteredTeamsParams:
    tournament_id: str


@dataclass
class ListRegisteredTeamsResponse:
    teams: dict[str, list[dict[str, str]]]


@dataclass
class ListRegisteredTeamsUseCase:
    def execute(self, params: ListRegisteredTeamsParams):
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        participants_grouped_by_team = defaultdict(list)

        participants_data = (
            Participant.objects.filter(tournament=tournament)
            .values("team", "id", "nickname")
            .order_by("team")
        )

        for participant in participants_data:
            team = participant["team"]
            participant_info = {
                "id": participant["id"],
                "nickname": participant["nickname"],
            }
            participants_grouped_by_team[team].append(participant_info)

        # Convert defaultdict to regular dict
        participants_grouped_by_team = dict(participants_grouped_by_team)
        return participants_grouped_by_team

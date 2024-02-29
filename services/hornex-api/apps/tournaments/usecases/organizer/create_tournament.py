# Description: Register a team in a tournament

from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Optional

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament, Prize
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)

CHECK_IN_DURATION = 15


@dataclass(frozen=True)
class CreateTournamentUseCaseParams:
    game: str
    name: str
    description: str
    organizer_id: str
    registration_start_date: datetime
    start_date: datetime.date
    start_time: datetime.time
    is_entry_free: bool
    prize_pool_enabled: bool
    open_classification: bool
    size: str
    team_size: str
    prizes: list[dict[str, any]]
    map: str
    terms: bool
    entry_fee: Optional[int] = None
    feature_image: Optional[str] = None


class CreateTournamentUseCase:
    @transaction.atomic
    def execute(self, params: CreateTournamentUseCaseParams) -> LeagueOfLegendsTournament:
        organizer = get_object_or_404(User, id=params.organizer_id)

        now = datetime.now(tz=UTC)
        start_at = datetime.combine(params.start_date, params.start_time, tzinfo=UTC)

        # logic validation
        if start_at < now:
            raise ValidationError({"error": "Start date must be in the future"})
        if params.registration_start_date > start_at:
            raise ValidationError({"error": "Registration start date must be before start date"})
        if not params.is_entry_free and not params.entry_fee:
            raise ValidationError({"error": "Invalid entry fee"})

        tournament = LeagueOfLegendsTournament.objects.create(
            name=params.name,
            description=params.description,
            organizer=organizer,
            registration_start_date=params.registration_start_date,
            check_in_duration=CHECK_IN_DURATION,
            start_date=start_at.date(),
            start_time=start_at.time(),
            is_entry_free=params.is_entry_free,
            entry_fee=params.entry_fee,
            prize_pool_enabled=params.prize_pool_enabled,
            open_classification=params.open_classification,
            max_teams=int(params.size),
            team_size=int(params.team_size),
            map=params.map,
            feature_image="tmt-6.jpeg",
        )

        # create prizes
        if not params.prize_pool_enabled:
            for prize in params.prizes:
                Prize.objects.create(
                    tournament=tournament,
                    place=prize.get("place"),
                    content=prize.get("content"),
                )

        # create challonge tournament
        ch_tournament = ChallongeTournament.create(
            name=tournament.name,
            teams=True,
            game=tournament.game,
        )

        if not ch_tournament:
            raise Exception("Tournament not created at challonge")

        tournament.challonge_tournament_id = ch_tournament.id
        tournament.challonge_tournament_url = f"https://challonge.com/{ch_tournament.url}"

        tournament.save()

        return tournament

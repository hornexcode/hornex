# Description: Register a team in a tournament

from dataclasses import dataclass
from datetime import UTC, date, datetime, time

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament, Prize
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)

CHECK_IN_DURATION = 15


@dataclass
class CreateTournamentUseCaseParams:
    game: str
    name: str
    description: str
    organizer_id: str
    registration_start_date: datetime
    check_in_duration: str
    start_date: date
    end_date: date
    start_time: time
    end_time: time
    feature_image: str
    is_entry_free: bool
    entry_fee: float
    prize_pool_enabled: bool
    open_classification: bool
    size: str
    team_size: str
    map_name: str
    prizes: list[dict[str, any]]
    timezone_offset: str


class CreateTournamentUseCase:
    @transaction.atomic
    def execute(self, params: CreateTournamentUseCaseParams) -> LeagueOfLegendsTournament:
        organizer = get_object_or_404(User, id=params.organizer_id)

        now = datetime.now(tz=UTC)

        start_at = datetime.combine(params.start_date, params.start_time, tzinfo=UTC)
        end_at = datetime.combine(params.end_date, params.end_time, tzinfo=UTC)

        if start_at < now:
            raise ValidationError({"error": "Start date must be in the future"})

        if (end_at - start_at).days > 1:
            raise ValidationError({"error": "Tournament must last 1 day"})

        if start_at > end_at:
            raise ValidationError({"error": "End date must be greater than start date"})

        if params.registration_start_date < start_at:
            raise ValidationError({"error": "Registration start date must be before start date"})

        if params.is_entry_free:
            params.entry_fee = 0

        if not params.is_entry_free and not params.entry_fee:
            raise ValidationError({"error": "Invalid entry fee"})

        tournament = LeagueOfLegendsTournament.objects.create(
            name=params.name,
            description=params.description,
            organizer=organizer,
            registration_start_date=params.registration_start_date,
            check_in_duration=CHECK_IN_DURATION,
            start_date=params.start_date,
            end_date=params.end_date,
            start_time=params.start_time,
            end_time=params.end_time,
            is_entry_free=params.is_entry_free,
            entry_fee=params.entry_fee,
            prize_pool_enabled=params.prize_pool_enabled,
            open_classification=params.open_classification,
            max_teams=int(params.size),
            team_size=int(params.team_size),
        )

        if not params.prize_pool_enabled:
            for prize in params.prizes:
                if prize.get("is_money") and not prize.get("amount"):
                    raise ValidationError({"error": f"Invalid amount for #{prize.get('place')}"})

                if not prize.get("is_money") and prize.get("content") == "":
                    raise ValidationError({"error": "No money prizes must have description"})

                Prize.objects.create(
                    tournament=tournament,
                    place=prize.get("place"),
                    is_money=prize.get("is_money"),
                    amount=prize.get("amount"),
                    content=prize.get("content"),
                )

        ch_tournament = ChallongeTournament.create(
            name=tournament.name,
            teams=True,
            start_at=start_at.strftime("%Y-%m-%dT%H:%M:%S%+00:00"),
            check_in_duration=tournament.check_in_duration,
            game=tournament.game,
        )

        if not ch_tournament:
            raise Exception("Tournament not created at challonge")

        tournament.challonge_tournament_id = ch_tournament.id
        tournament.challonge_tournament_url = f"https://challonge.com/{ch_tournament.url}"

        tournament.save()

        return tournament

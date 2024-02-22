# Description: Register a team in a tournament

import uuid
from dataclasses import dataclass
from datetime import date, datetime, time

import structlog
from django.db import transaction
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament, Prize
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)

CHECK_IN_DURATION = 15


@dataclass
class PrizeParams:
    place: int
    is_money: bool
    amount: int
    content: str | None


@dataclass
class CreateTournamentUseCaseParams:
    game: str
    name: str
    description: str
    organizer_id: uuid.UUID
    registration_start_date: datetime
    check_in_duration: int
    start_date: date
    end_date: date
    start_time: time
    end_time: time
    feature_image: str
    is_entry_free: bool
    entry_fee: int
    prize_pool_enabled: bool
    open_classification: bool
    size: int
    team_size: int
    map: str
    prizes: list[PrizeParams]


class CreateTournamentUseCase:
    """
    Create a tournament
    """

    @transaction.atomic
    def execute(self, params: CreateTournamentUseCaseParams) -> LeagueOfLegendsTournament:
        try:
            organizer = User.objects.get(id=params.organizer_id)
        except User.DoesNotExist:
            raise ValidationError({"error": "User not found"})

        start_at = datetime.combine(params.start_date, params.start_time)
        end_at = datetime.combine(params.end_date, params.end_time)

        # Challonge constraint
        if start_at <= datetime.now():
            raise ValidationError({"error": "Start date needs to be in the future"})

        if start_at > end_at:
            raise ValidationError({"error": "Start date is greater than end date"})

        if params.registration_start_date > start_at:
            raise ValidationError({"error": "Registration start date is greater than start date"})

        if params.prize_pool_enabled and params.is_entry_free:
            raise ValidationError({"error": "Prize pool cannot be enabled when the entry is free"})

        if not params.prize_pool_enabled:
            self.validate_prizes(params.prizes)

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
            max_teams=params.size,
            team_size=params.team_size,
        )

        if not params.prize_pool_enabled:
            for prize in params.prizes:
                if prize.is_money and not prize.amount:
                    raise ValidationError({"error": f"Invalid amount for #{prize.place}"})

                if not prize.is_money and prize.content == "":
                    raise ValidationError({"error": "No money prizes must have description"})

                Prize.objects.create(
                    tournament=tournament,
                    place=prize.place,
                    is_money=prize.is_money,
                    amount=prize.amount,
                    content=prize.content,
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

    def validate_prizes(self, prizes: list[PrizeParams]):
        required_places = [1, 2, 3]
        found_places = []

        for prize in prizes:
            if prize.place in required_places:
                found_places.append(prize.place)

        if len(found_places) != len(required_places):
            raise ValidationError({"error": "Prizes for places 1, 2, and 3 are required."})

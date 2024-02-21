# Description: Register a team in a tournament

from datetime import datetime

import structlog
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.tournaments.models import LeagueOfLegendsTournament, Prize
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)

CHECK_IN_DURATION = 15


class CreateTournamentUseCaseParams:
    game: str
    name: str
    description: str
    organizer_id: str
    registration_start_date: str
    check_in_duration: str
    start_date: str
    end_date: str
    start_time: str
    end_time: str
    feature_image: str
    is_entry_free: bool
    entry_fee: float
    prize_pool_enabled: bool
    open_classification: bool
    size: str
    team_size: str
    map_name: str
    prizes: list[dict[str, any]]

    def __init__(self, **kwargs):
        self.validate(**kwargs)
        self.game = kwargs.get("game")
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")
        self.organizer_id = kwargs.get("organizer_id")
        self.registration_start_date = kwargs.get("registration_start_date")
        self.check_in_duration = kwargs.get("check_in_duration")
        self.start_date = kwargs.get("start_date")
        self.end_date = kwargs.get("end_date")
        self.start_time = kwargs.get("start_time")
        self.end_time = kwargs.get("end_time")
        self.feature_image = kwargs.get("feature_image")
        self.is_entry_free = kwargs.get("is_entry_free")
        self.entry_fee = kwargs.get("entry_fee")
        self.prize_pool_enabled = kwargs.get("prize_pool_enabled")
        self.open_classification = kwargs.get("open_classification")
        self.size = kwargs.get("size")
        self.team_size = kwargs.get("team_size")
        self.map_name = kwargs.get("map_name")
        self.prizes = kwargs.get("prizes")

    class Validator(serializers.Serializer):
        class PrizeSerializer(serializers.Serializer):
            place = serializers.IntegerField()
            is_money = serializers.BooleanField()
            amount = serializers.FloatField()
            content = serializers.CharField(required=False, allow_blank=True)

        game = serializers.CharField()
        name = serializers.CharField()
        description = serializers.CharField()
        organizer_id = serializers.UUIDField()
        registration_start_date = serializers.DateTimeField()
        # check_in_duration = serializers.CharField()
        start_date = serializers.DateField()
        end_date = serializers.DateField()
        start_time = serializers.TimeField()
        end_time = serializers.TimeField()
        feature_image = serializers.URLField(required=False)
        is_entry_free = serializers.BooleanField()
        entry_fee = serializers.FloatField(required=False)
        prize_pool_enabled = serializers.BooleanField()
        open_classification = serializers.BooleanField()
        size = serializers.CharField()
        team_size = serializers.CharField()
        # map_name = serializers.CharField()
        prizes = PrizeSerializer(many=True)

    def validate(self, **kwargs):
        params = self.Validator(data=kwargs)
        params.is_valid(raise_exception=True)
        params = params.validated_data

        if params.get("prize_pool_enabled") and params.get("is_entry_free"):
            raise ValidationError({"error": "Prize pool cannot be enabled when the entry is free"})

        if not params.get("prize_pool_enabled"):
            self.validate_prizes(params.get("prizes", []))

    def validate_prizes(self, prizes):
        required_places = [1, 2, 3]
        found_places = []

        for prize in prizes:
            place = prize.get("place")
            if place in required_places:
                found_places.append(place)

        if len(found_places) != len(required_places):
            raise ValidationError({"error": "Prizes for places 1, 2, and 3 are required."})


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

        registration_start_date = datetime.strptime(
            params.registration_start_date, "%Y-%m-%dT%H:%M:%S.000Z"
        )
        start_date = datetime.strptime(params.start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(params.end_date, "%Y-%m-%d").date()
        start_time = datetime.strptime(params.start_time, "%H:%M").time()
        end_time = datetime.strptime(params.end_time, "%H:%M").time()

        start_at = datetime.combine(start_date, start_time)
        end_at = datetime.combine(end_date, end_time)

        # Challonge constraint
        if start_at <= datetime.now():
            raise ValidationError({"error": "Start date needs to be in the future"})

        if start_at > end_at:
            raise ValidationError({"error": "Start date is greater than end date"})

        if registration_start_date > start_at:
            raise ValidationError({"error": "Registration start date is greater than start date"})

        if params.is_entry_free:
            params.entry_fee = 0

        if not params.is_entry_free and not params.entry_fee:
            raise ValidationError({"error": "Invalid entry fee"})

        tournament = LeagueOfLegendsTournament.objects.create(
            name=params.name,
            description=params.description,
            organizer=organizer,
            registration_start_date=registration_start_date,
            # TO BE REMOVED
            registration_end_date=registration_start_date,
            check_in_duration=CHECK_IN_DURATION,
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
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

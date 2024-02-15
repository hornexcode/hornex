# Description: Register a team in a tournament

import structlog
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.payments.models import PaymentRegistration
from apps.tournaments.models import Prize, Registration, Tournament
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


class CreateTournamentUseCaseParams:
    organizer_id: str
    game: str
    description: str
    registration_start_date: str
    registration_end_date: str
    start_date: str
    end_date: str
    start_time: str
    end_time: str
    feature_image: str
    is_entry_free: bool
    prize_pool_enabled: bool
    open_classification: bool
    size: str
    team_size: str
    map_name: str
    prizes: list[dict[str, any]]

    cleaned_data: "Validator"

    def __init__(self, **kwargs):
        self.validate(**kwargs)
        self.organizer_id = kwargs.get("organizer_id")
        self.game = kwargs.get("game")
        self.description = kwargs.get("description")
        self.registration_start_date = kwargs.get("registration_start_date")
        self.registration_end_date = kwargs.get("registration_end_date")
        self.start_date = kwargs.get("start_date")
        self.end_date = kwargs.get("end_date")
        self.start_time = kwargs.get("start_time")
        self.end_time = kwargs.get("end_time")
        self.feature_image = kwargs.get("feature_image")
        self.is_entry_free = kwargs.get("is_entry_free")
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
            content = serializers.CharField()

        organizer_id = serializers.UUIDField()
        game = serializers.CharField()
        description = serializers.CharField()
        registration_start_date = serializers.DateTimeField()
        registration_end_date = serializers.DateTimeField()
        start_date = serializers.DateTimeField()
        end_date = serializers.DateTimeField()
        start_time = serializers.TimeField()
        end_time = serializers.TimeField()
        feature_image = serializers.URLField(required=False)
        is_entry_free = serializers.BooleanField()
        prize_pool_enabled = serializers.BooleanField()
        open_classification = serializers.BooleanField()
        size = serializers.CharField()
        team_size = serializers.CharField()
        map_name = serializers.CharField()
        prizes = PrizeSerializer(many=True)

    def validate(self, **kwargs):
        params = self.Validator(data=kwargs)
        params.is_valid(raise_exception=True)


class CreateTournamentUseCase:
    """
    Confirm a team in a tournament
    """

    @transaction.atomic
    def execute(self, params: CreateTournamentUseCaseParams) -> Tournament:
        try:
            organizer = User.objects.get(id=params.organizer_id)
        except User.DoesNotExist:
            raise ValidationError({"detail": "User not found"})

        if params.registration_start_date > params.registration_end_date:
            raise ValidationError(
                {"detail": "Registration start date is greater than registration end date"}
            )

        if params.start_date > params.end_date:
            raise ValidationError({"detail": "Start date is greater than end date"})

        if params.registration_start_date > params.start_date:
            raise ValidationError({"detail": "Registration start date is greater than start date"})

        tournament = Tournament.objects.create(
            organizer=organizer,
            game=params.game,
            description=params.description,
            registration_start_date=params.registration_start_date,
            registration_end_date=params.registration_end_date,
            start_date=params.start_date,
            end_date=params.end_date,
            start_time=params.start_time,
            end_time=params.end_time,
            is_entry_free=params.is_entry_free,
            prize_pool_enabled=params.prize_pool_enabled,
            open_classification=params.open_classification,
            max_teams=params.size,
            team_size=params.team_size,
        )

        if not params.prize_pool_enabled:
            for prize in params.prizes:
                Prize.objects.create(
                    tournament=tournament,
                    place=prize.get("place"),
                    is_money=prize.get("is_money"),
                    amount=prize.get("amount"),
                    content=prize.get("content"),
                )

        return tournament

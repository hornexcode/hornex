from rest_framework import serializers


class PrizeSerializer(serializers.Serializer):
    place = serializers.IntegerField()
    content = serializers.CharField()


class TournamentCreateSerializer(serializers.Serializer):
    game = serializers.CharField()
    name = serializers.CharField()
    # description = serializers.CharField(required=False)
    registration_start_date = serializers.DateTimeField()
    start_date = serializers.DateField()
    start_time = serializers.TimeField()
    feature_image = serializers.URLField(required=False)
    is_entry_free = serializers.BooleanField()
    entry_fee = serializers.FloatField(required=False)
    prize_pool_enabled = serializers.BooleanField()
    open_classification = serializers.BooleanField()
    size = serializers.CharField()
    team_size = serializers.CharField()
    prizes = PrizeSerializer(many=True)
    terms = serializers.BooleanField()


class CreateAndRegisterTeamIntoTournamentParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    name = serializers.CharField(max_length=255)
    user_id = serializers.UUIDField()
    member_1_email = serializers.EmailField()
    member_2_email = serializers.EmailField()
    member_3_email = serializers.EmailField()
    member_4_email = serializers.EmailField()


class RegisterTeamIntoTournamentParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    team_id = serializers.UUIDField()


class CheckInTournamentParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    organizer_id = serializers.UUIDField()


class StartMatchParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    match_id = serializers.UUIDField()
    user_id = serializers.UUIDField()


class FinishMatchParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    match_id = serializers.UUIDField()
    user_id = serializers.UUIDField()


class EndTournamentParams(serializers.Serializer):
    tournament_id = serializers.UUIDField()
    user_id = serializers.UUIDField()

from rest_framework import serializers


class PrizeSerializer(serializers.Serializer):
    place = serializers.IntegerField()
    content = serializers.CharField()


class TournamentCreateSerializer(serializers.Serializer):
    game = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
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
    map = serializers.CharField()
    terms = serializers.BooleanField()


class RegisterSerializer(serializers.Serializer):
    class PlayerSerializer(serializers.Serializer):
        nickname = serializers.CharField()
        email = serializers.EmailField()

    team_name = serializers.CharField()

    player1 = PlayerSerializer()
    player2 = PlayerSerializer()
    player3 = PlayerSerializer()
    player4 = PlayerSerializer()
    player5 = PlayerSerializer()
    users = serializers.ListField(child=serializers.ListField(child=serializers.CharField()))
    team = serializers.CharField()


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

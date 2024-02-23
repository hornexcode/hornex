from rest_framework import serializers


class PrizeSerializer(serializers.Serializer):
    place = serializers.IntegerField()
    is_money = serializers.BooleanField()
    amount = serializers.FloatField()
    content = serializers.CharField(required=False, allow_blank=True)


class TournamentCreateSerializer(serializers.Serializer):
    game = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField()
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
    prizes = PrizeSerializer(many=True)


class RegisterSerializer(serializers.Serializer):
    users = serializers.ListField(child=serializers.ListField(child=serializers.CharField()))
    team = serializers.CharField()

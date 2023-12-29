from rest_framework import serializers


class CreatePaymentRegistrationSerializer(serializers.Serializer):
    registration = serializers.UUIDField()
    name = serializers.CharField()
    cpf = serializers.CharField()

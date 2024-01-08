from rest_framework import serializers


class CreatePixPaymentRegistrationSerializer(serializers.Serializer):
    registration = serializers.UUIDField()
    name = serializers.CharField()
    cpf = serializers.CharField()
    # amount = serializers.IntegerField()


class CreateStripePaymentRegistrationSerializer(serializers.Serializer):
    registration = serializers.UUIDField()
    # amount = serializers.IntegerField()


class PixSerializer(serializers.Serializer):
    endToEndId = serializers.CharField()
    txid = serializers.CharField()
    chave = serializers.CharField()
    valor = serializers.CharField()
    horario = serializers.CharField()
    infoPagador = serializers.CharField()


class PixReceivedSerializer(serializers.Serializer):
    pix = PixSerializer(many=True)

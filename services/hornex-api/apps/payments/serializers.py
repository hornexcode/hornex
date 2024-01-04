from rest_framework import serializers


class CreatePaymentRegistrationSerializer(serializers.Serializer):
    registration = serializers.UUIDField()
    name = serializers.CharField()
    cpf = serializers.CharField()


class PixSerializer(serializers.Serializer):
    endToEndId = serializers.CharField()
    txid = serializers.CharField()
    chave = serializers.CharField()
    valor = serializers.CharField()
    horario = serializers.CharField()
    infoPagador = serializers.CharField()


class PixReceivedSerializer(serializers.Serializer):
    pix = PixSerializer(many=True)

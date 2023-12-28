import hashlib
import logging
import os
import uuid

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.payments.models import RegistrationPayment
from apps.payments.serializers import CreatePaymentRegistrationSerializer
from apps.tournaments.models import Registration
from lib.efi.client import Efi

logger = logging.getLogger("django")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_payment_registration(request):
    form = CreatePaymentRegistrationSerializer(data=request.data)
    if not form.is_valid():
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        reg = Registration.objects.get(id=form.data["registration"])
    except Registration.DoesNotExist:
        return Response({"error": "Registration does not exist"}, status=404)

    if reg.status != Registration.RegistrationStatusType.PENDING:
        return Response({"error": "Registration is not pending"}, status=400)

    efi = Efi()

    # txid = hashlib.sha256(str(form.data["registration"]).encode()).hexdigest()[:35]

    txid = hashlib.sha256(uuid.uuid4().__str__().encode()).hexdigest()[:35]

    pixConfig = {
        "calendario": {"expiracao": int(os.getenv("PIX_EXPIRATION", 3600))},
        "devedor": {"cpf": form.data.get("cpf"), "nome": form.data.get("name")},
        # "valor": {"original": "%.2f" % reg.tournament.entry_fee},
        "valor": {"original": "2.32"},
        "chave": os.getenv("PIX_KEY"),
        "solicitacaoPagador": f"Cobrança de registro em torneio. {reg.tournament.name}",
    }

    try:
        qrcode = efi.charge(txid, pixConfig)
    except Exception as e:
        logger.info(e)
        return Response({"error": "Error on creating pix charge"}, status=500)

    try:
        RegistrationPayment.objects.create(
            xid=txid,
            user=request.user,
            tournament=reg.tournament,
            team=reg.team,
            amount=reg.tournament.entry_fee,
        )
    except Exception as e:
        logger.info(e)
        return Response({"error": "Error on creating payment"}, status=500)

    return Response(qrcode, status=status.HTTP_201_CREATED)

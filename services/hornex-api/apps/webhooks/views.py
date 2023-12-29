import logging
from dataclasses import dataclass

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.payments.models import PixTransaction

logger = logging.getLogger("django")


@dataclass
class Pix:
    endToEndId: str
    txid: str
    chave: str
    valor: str
    horario: str
    infoPagador: str


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
@transaction.atomic
def efi_controller(request):
    if not request.data.get("pix"):
        logger.warn("Efi webhook did not sent any data")
        return Response(status=status.HTTP_400_BAD_REQUEST)

    pix = Pix(**request.data["pix"][0])
    pix_transactions = PixTransaction.objects.get(txid=pix.txid)
    pix_transactions.registration_payment.confirm_payment()

    regis = pix_transactions.registration_payment.registration
    team = regis.team
    pix_transactions.registration_payment.registration.accept()
    pix_transactions.registration_payment.registration.tournament.confirm_registration(
        team
    )

    logger.info("Efi webhook received and processed")
    return Response(status=status.HTTP_200_OK)

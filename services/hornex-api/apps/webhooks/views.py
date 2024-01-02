import os
from dataclasses import dataclass

import structlog
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.payments.models import RegistrationPayment

logger = structlog.get_logger(__name__)


@dataclass
class Pix:
    endToEndId: str
    txid: str
    chave: str
    valor: str
    horario: str
    infoPagador: str


# {'pix': [{'endToEndId': 'E09089356202312302342API9295b711', 'txid': '4c4f7c7ea29c4be88c4251c65d6f6fb7', 'chave': '5f0d0e75-dde2-473e-ab2f-d9d140f68e62', 'valor': '1.00', 'horario': '2023-12-30T23:42:18.000Z', 'infoPagador': 'Teste de pagamento em ambiente sandbox'}]}


def is_efi_request(func):
    def wrapper(request, *args, **kwargs):
        if request.GET.get("hmac", None) != os.getenv("EFI_WEBHOOK_SIGNATURE", None):
            logger.warn("Efi webhook received from an invalid source")
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return func(request, *args, **kwargs)

    return wrapper


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
@transaction.atomic
@is_efi_request
def efi_controller(request):
    # IMPORTANT
    # Need to check if the request is from efi
    logger.debug("Efi webhook received", query_params=request.GET, meta=request.META)
    logger.info(request.data)
    if not request.data.get("pix"):
        logger.warn("Efi webhook did not sent any data")
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        pix = Pix(**request.data["pix"][0])
    except Exception as e:
        logger.error("Error on parsing pix data", error=e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    registration_payment = RegistrationPayment.objects.get(id=pix.txid)
    logger.info("registration_payment -> ", obj=registration_payment)

    logger.info("Efi webhook received and processed")
    return Response(status=status.HTTP_200_OK)

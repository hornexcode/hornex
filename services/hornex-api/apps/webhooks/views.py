import hashlib
import hmac
import os
from dataclasses import dataclass

import structlog
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.payments.models import PaymentRegistration

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


def verify_ip(view_func):
    def _wrapped_view(request, *args, **kwargs):
        ip = request.META["REMOTE_ADDR"]
        allowed_ips = os.getenv("EFI_AUTHORIZED_IPS")
        if ip not in allowed_ips:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return view_func(request, *args, **kwargs)

    return _wrapped_view


def verify_hmac_decorator(view_func):
    def _wrapped_view(request, *args, **kwargs):
        secret_key = os.getenv("EFI_HMAC_SECRET_KEY")
        secret_msg = os.getenv("EFI_HMAC_SECRET_MESSAGE")
        print(secret_key, secret_msg)
        if not secret_key or not secret_msg:
            logger.warn("The hmac secret key or/and message are missing")
            return Response({"error": "HMAC secrets are missing"}, status=500)

        try:
            verify_hmac(request.GET, secret_key, secret_msg)
        except ValueError as e:
            logger.warn(
                {
                    "error": str(e),
                    "message": "Error verifying received from Efi",
                }
            )
            return Response({"error": str(e)}, status=400)

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def verify_hmac(query_params, secret_key, secret_msg):
    hmac_signature = query_params.get("hmac")
    if not hmac_signature:
        raise ValueError("HMAC signature is missing")

    expected_hmac = hmac.new(
        secret_key.encode(), secret_msg.encode(), hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_hmac, hmac_signature):
        raise ValueError("Invalid HMAC")

    return True


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
@transaction.atomic
@verify_ip
@verify_hmac_decorator
def efi_controller(request):
    if not request.data.get("pix"):
        logger.warn("Efi webhook did not send any data")
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        pix = Pix(**request.data["pix"][0])
    except Exception as e:
        logger.error("Error on parsing pix data", error=e)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    payment_registration = PaymentRegistration.objects.get(id=pix.txid)
    logger.info("payment_registration -> ", obj=payment_registration)

    if payment_registration.status != PaymentRegistration.Status.PENDING:
        logger.error("Error: registration already paid, responding 200 to stop webhook")
        return Response(status=status.HTTP_200_OK)

    logger.info("Efi webhook received and processed")
    return Response(status=status.HTTP_200_OK)

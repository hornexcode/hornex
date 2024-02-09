import os
from dataclasses import dataclass

import stripe
import structlog
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.payments.models import PaymentRegistration
from apps.payments.serializers import PixReceivedSerializer
from apps.webhooks.decorators import verify_hmac, verify_ip

logger = structlog.get_logger(__name__)

stripe.api_key = os.getenv("STRIPE_API_KEY")
stripe_endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


@dataclass
class PixDTO:
    endToEndId: str
    txid: str
    chave: str
    valor: str
    horario: str
    infoPagador: str


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
@verify_ip
@verify_hmac
@transaction.atomic
def efi_controller(request):
    pix_serializer = PixReceivedSerializer(data=request.data)
    if not pix_serializer.is_valid():
        return Response(
            {"message": "Invalid payload"}, status=status.HTTP_400_BAD_REQUEST
        )
    pix = PixDTO(**pix_serializer.data["pix"][0])

    try:
        payment_registration = PaymentRegistration.objects.get(id=pix.txid)
    except PaymentRegistration.DoesNotExist:
        logger.error("PaymentRegistration.DoesNotExist", txid=pix.txid)
        return Response(
            {"message": "Payment registration not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if float(pix.valor) != payment_registration.get_total_amount():
        return Response(
            {"message": "Amount paid does not match with current registration amount"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        payment_registration.confirm_payment()
    except Exception as e:
        logger.error("payment_registration.confirm_payment", error=e)
        return Response(
            {"message": "Something went wrong while confirming the payment"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    registration = payment_registration.registration
    try:
        registration.confirm_registration()
    except Exception as e:
        logger.error("registration.confirm_registration", error=e)
        return Response(
            {"message": "Something went wrong while confirming the registration"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {"message": "Successfully confirmed the payment"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
def stripe_controller(request):
    event = None
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e

    # Handle the event
    if event.type == "payment_intent.succeeded":
        payment_intent = event.data.object  # contains a stripe.PaymentIntent

        registration_id = payment_intent["metadata"]["registration_id"]

        try:
            payment_registration = PaymentRegistration.objects.get(id=registration_id)
        except PaymentRegistration.DoesNotExist:
            logger.error(
                "PaymentRegistration.DoesNotExist", registration_id=registration_id
            )
            return Response(
                {"message": "Payment registration not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment_registration.confirm_payment()
        except Exception as e:
            logger.error("payment_registration.confirm_payment", error=e)
            return Response(
                {"message": "Something went wrong while confirming the payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        registration = payment_registration.registration

        try:
            registration.confirm_registration()
        except Exception as e:
            logger.error("registration.confirm_registration", error=e)
            return Response(
                {"message": "Something went wrong while confirming the registration"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info("PaymentIntent was successful!", payment_intent=payment_intent)
    else:
        print(f"Unhandled event type {event.type}")

    return Response(
        {"message": "Successfully confirmed the payment"},
        status=status.HTTP_200_OK,
    )

import structlog
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.payments.dto import RegistrationPaymentDTO
from apps.payments.gateway import get_payment_gateway
from apps.payments.models import PaymentRegistration
from apps.payments.serializers import (
    CreatePixPaymentRegistrationSerializer,
    CreateStripePaymentRegistrationSerializer,
)
from apps.tournaments.models import Registration
from jwt_token.authentication import JWTAuthentication

logger = structlog.get_logger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@transaction.atomic
def create_payment_registration(request):
    kwargs = {}
    if "credit_card" in request.GET:
        kwargs["credit_card"] = 1
        form = CreateStripePaymentRegistrationSerializer(data=request.data)

        if not form.is_valid():
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        form = CreatePixPaymentRegistrationSerializer(data=request.data)

        if not form.is_valid():
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
        kwargs["cpf"] = form.data["cpf"]
        kwargs["name"] = form.data["name"]

    try:
        registration = Registration.objects.get(id=form.data["registration"])
        if registration.status != Registration.RegistrationStatusType.PENDING:
            return Response({"error": "Registration is not pending"}, status=400)
    except Registration.DoesNotExist:
        return Response({"error": "Registration does not exist"}, status=404)

    try:
        payment_registration = PaymentRegistration.objects.create(
            registration=registration,
            amount=registration.tournament.entry_fee * registration.tournament.team_size,
        )
    except Exception as e:
        logger.error("Error on creating payment", error=e)
        return Response({"error": "Error on creating payment"}, status=500)

    payment_registration = RegistrationPaymentDTO(
        id=payment_registration.id.hex,
        amount=payment_registration.amount,
        email=request.user.email,
        **kwargs,
    )

    payment_gateway = get_payment_gateway(**kwargs)

    try:
        resp = payment_gateway.charge(payment_registration)
    except Exception as e:
        logger.error("Error on charging user", error=e)
        return Response({"error": "Error on creating payment"}, status=500)
    return Response(resp, status=status.HTTP_201_CREATED)

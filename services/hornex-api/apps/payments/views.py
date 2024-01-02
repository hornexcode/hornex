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
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.payments.dto import RegistrationPaymentDTO
from apps.payments.gateway import get_payment_gateway
from apps.payments.models import RegistrationPayment
from apps.payments.serializers import CreatePaymentRegistrationSerializer
from apps.tournaments.models import Registration

logger = structlog.get_logger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@transaction.atomic
def create_payment_registration(request):
    form = CreatePaymentRegistrationSerializer(data=request.data)
    if not form.is_valid():
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        registration = Registration.objects.get(id=form.data["registration"])
    except Registration.DoesNotExist:
        return Response({"error": "Registration does not exist"}, status=404)

    if registration.status != Registration.RegistrationStatusType.PENDING:
        return Response({"error": "Registration is not pending"}, status=400)

    try:
        payment_registration = RegistrationPayment.objects.create(
            registration=registration,
            amount=registration.tournament.entry_fee,
        )
    except Exception as e:
        logger.error("Error on creating payment", error=e)
        return Response({"error": "Error on creating payment"}, status=500)

    payment_registration = RegistrationPaymentDTO(
        id=payment_registration.id.hex,
        name=form.data["name"],
        cpf=form.data["cpf"],
        amount=registration.tournament.entry_fee / 100,
    )

    payment_gateway = get_payment_gateway()

    try:
        resp = payment_gateway.charge(payment_registration)
    except Exception as e:
        logger.error("Error on charging user", error=e)
        return Response({"error": "Error on creating payment"}, status=500)
    return Response(resp, status=status.HTTP_201_CREATED)

import os

import stripe
import structlog

from apps.payments.dto import RegistrationPaymentDTO
from apps.payments.gateway import PaymentGateway

logger = structlog.get_logger(__name__)

endpoint_secret = "whsec_SBK7tKkjmCsWxXaAg3HHg9Ji9ZL0FKVT"

stripe.api_key = os.getenv("STRIPE_API_KEY")


class Stripe(PaymentGateway):
    def charge(self, payment_registration: RegistrationPaymentDTO):
        try:
            customer = stripe.Customer.create(
                name=payment_registration.name,
                email=payment_registration.email,
            )
        except Exception as e:
            logger.error("Error on creating customer", error=e)
            raise e

        try:
            payment_intent = stripe.PaymentIntent.create(
                payment_method_types=["card"],
                amount=int(payment_registration.amount),
                currency="brl",
                customer=customer.id,
                metadata={"registration_id": payment_registration.id},
            )
            return payment_intent
        except Exception as e:
            logger.error("Error on charging user", error=e)
            raise e

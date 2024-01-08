from abc import ABC, abstractmethod

import structlog

from apps.payments.dto import RegistrationPaymentDTO

logger = structlog.get_logger(__name__)


class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, payment_registration: RegistrationPaymentDTO):
        raise NotImplementedError


def get_payment_gateway(*args, **kwargs) -> PaymentGateway:
    if "credit_card" in kwargs:
        from lib.stripe.client import Stripe

        return Stripe()

    from lib.efi.client import Efi

    return Efi()

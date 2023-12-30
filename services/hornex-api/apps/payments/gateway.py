from abc import ABC, abstractmethod

import structlog

from apps.payments.dto import RegistrationPaymentDTO

logger = structlog.get_logger(__name__)


class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, registration_payment: RegistrationPaymentDTO):
        raise NotImplementedError


def get_payment_gateway() -> PaymentGateway:
    from lib.efi.client import Efi

    return Efi()

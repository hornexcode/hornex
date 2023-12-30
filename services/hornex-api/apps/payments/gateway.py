import structlog

logger = structlog.get_logger(__name__)


def get_payment_gateway() -> "apps.payments.gateway.Clientable":  # noqa: F821
    from lib.efi.client import Efi

    return Efi()

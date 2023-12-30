import structlog

from lib.efi.client import Efi

logger = structlog.get_logger(__name__)


def get_payment_gateway():
    return Efi()

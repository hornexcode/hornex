import hashlib
import hmac
import os

import structlog
from rest_framework import status
from rest_framework.response import Response

logger = structlog.get_logger(__name__)


def verify_ip(view_func):
    def _wrapped_view(request, *args, **kwargs):
        ip = request.META["REMOTE_ADDR"]
        allowed_ips = os.getenv("EFI_AUTHORIZED_IPS")
        if ip not in allowed_ips:
            logger.warn(
                {
                    "message": "Unauthorized IP tried to access the webhook",
                    "ip": ip,
                }
            )
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return view_func(request, *args, **kwargs)

    return _wrapped_view


def verify_hmac(view_func):
    def _wrapped_view(request, *args, **kwargs):
        ok = check_signature(request.GET.get("hmac", None))
        if ok:
            return view_func(request, *args, **kwargs)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    return _wrapped_view


def check_signature(hmac_signature=None):
    secret_key = os.getenv("EFI_HMAC_SECRET_KEY", "")
    secret_msg = os.getenv("EFI_HMAC_SECRET_MESSAGE", "")

    if hmac_signature is None:
        return False

    expected_hmac = hmac.new(
        secret_key.encode(), secret_msg.encode(), hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected_hmac, hmac_signature)

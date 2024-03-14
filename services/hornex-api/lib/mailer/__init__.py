import os

import resend

# Import accounts
from lib.mailer._accounts import send_welcome_email  # noqa

resend.api_key = os.getenv("RESEND_API_KEY", "")


__all__ = ["send_welcome_email"]

import os

import resend

resend.api_key = os.environ["RESEND_API_KEY"]

# Import accounts
from lib.mailer._accounts import send_welcome_email

__all__ = ["send_welcome_email"]

import os

import resend

# Import accounts
from lib.mailer._accounts import send_welcome_email
from lib.mailer._tournaments import send_match_code_email

resend.api_key = os.getenv("RESEND_API_KEY", "")


__all__ = ["send_welcome_email", "send_match_code_email"]

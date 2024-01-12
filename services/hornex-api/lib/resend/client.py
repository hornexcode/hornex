import os

import resend
import structlog

logger = structlog.get_logger(__name__)
resend.api_key = os.getenv("RESEND_API_KEY", "")


class Resend:
    @classmethod
    def send(cls, subject: str, message: str, recipient: str) -> None:
        if not resend.api_key:
            return

        r = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",
                "to": "pedro357bm@gmail.com",
                "subject": subject,
                "html": f"<p>{message}</p>",
            }
        )
        logger.info("Resend.send", response=r)

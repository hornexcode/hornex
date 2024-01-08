import os
from abc import ABCMeta

import resend
import structlog

logger = structlog.get_logger(__name__)
resend.api_key = os.getenv("RESEND_API_KEY")


class Clientable(ABCMeta):
    ...


class Resend(Clientable):
    @staticmethod
    def send(subject: str, message: str, recipient: str) -> None:
        r = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",
                "to": "pedro357bm@gmail.com",
                "subject": subject,
                "html": f"<p>{message}</p>",
            }
        )
        logger.info("Resend.send", response=r)

from lib.mailer._sender import _send_email


def send_welcome_email(to: str):
    subject = "Welcome to Hornex"
    body = "Welcome to Hornex! We're excited to have you on board."
    _send_email(to, subject, body)

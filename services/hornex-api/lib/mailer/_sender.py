import resend


def _send_email(to, subject, body):
    params = {
        "from": "Hornex <no-reply@hornex.gg>",
        "to": to,
        "subject": subject,
        "text": body,
    }
    resend.Emails.send(params)

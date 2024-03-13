from lib.mailer._sender import _send_email


def send_match_code_email(to: list[str], team_a: str, team_b: str, code: str):
    subject = "Match Code"
    body = f"{team_a} vs {team_b}: your match is about to start, here is your code to join in the match: {code}"  # noqa: E501
    _send_email(to, subject, body)

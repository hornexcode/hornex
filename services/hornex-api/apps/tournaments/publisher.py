from lib.rabbitmq import send_message


def publish_match_started(match_id: str) -> None:
    message = {"id": match_id}
    send_message(message, "matches.event.started", "matches")

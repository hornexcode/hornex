from lib.rabbitmq import send_message


def publish_tournament_created(tournament_id: str) -> None:
    message = f'{{"tournament_id": "{tournament_id}"}}'
    send_message(message, "tournament.created")

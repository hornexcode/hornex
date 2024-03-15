import pika

from lib.rabbitmq import channel

exchange_name = "amq.direct"


def send_message(message: str, routing_key: str) -> None:
    channel.basic_publish(
        exchange=exchange_name,
        body=message,
        routing_key=routing_key,
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ),
    )

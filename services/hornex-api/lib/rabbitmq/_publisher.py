import json

import pika

from lib.rabbitmq import channel


def send_message(message: dict, routing_key: str, exchange: str) -> None:
    properties = pika.BasicProperties(
        content_type="application/json",
        content_encoding="utf-8",
    )

    channel.basic_publish(
        exchange=exchange,
        body=json.dumps(message),
        routing_key=routing_key,
        properties=properties,
    )

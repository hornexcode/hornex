import json
from dataclasses import dataclass

import pika

from apps.tournaments.events import Bus


@dataclass
class RabbitMQBus(Bus):
    host: str
    port: int
    user: str
    password: str
    connection = None
    channel = None

    def connect(self):
        credentials = pika.PlainCredentials(self.user, self.password)
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(self.host, 5672, "/", credentials)
        )
        self.channel = self.connection.channel()

    def publish(self, exchange: str, routing_key: str, message: str):
        """
        Publishes a message to the RabbitMQ exchange
        :topic str: Equivalent to the routing key
        :message str: The message to be published
        """
        properties = pika.BasicProperties(
            content_type="application/json",
            content_encoding="utf-8",
        )

        self.channel.basic_publish(
            exchange=exchange,
            body=json.dumps(message),
            routing_key=routing_key,
            properties=properties,
        )

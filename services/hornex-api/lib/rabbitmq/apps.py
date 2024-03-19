from django.apps import AppConfig
from django.conf import settings

from ._bus import RabbitMQBus


class RabbitmqConfig(AppConfig):
    name = "lib.rabbitmq"

    def ready(self):
        if not settings.TESTING:
            global rabbitmq_bus
            rabbitmq_bus = RabbitMQBus(
                settings.RABBITMQ_HOST,
                settings.RABBITMQ_PORT,
                settings.RABBITMQ_USER,
                settings.RABBITMQ_PASSWORD,
            )
            try:
                rabbitmq_bus.connect()
            except Exception as e:
                print(f"RabbitMQ connection failed: {e}")
                return

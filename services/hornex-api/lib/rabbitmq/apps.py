from django.apps import AppConfig
from django.conf import settings

from ._bus import RabbitMQBus


class RabbitmqConfig(AppConfig):
    name = "lib.rabbitmq"

    def ready(self):
        global rabbitmq_bus
        rabbitmq_bus = RabbitMQBus(
            settings.RABBITMQ_HOST,
            settings.RABBITMQ_PORT,
            settings.RABBITMQ_USER,
            settings.RABBITMQ_PASSWORD,
        )
        rabbitmq_bus.connect()

<<<<<<< HEAD
=======
import pika
from django.conf import settings

user = settings.RABBITMQ_USER
password = settings.RABBITMQ_PASSWORD
host = settings.RABBITMQ_HOST

credentials = pika.PlainCredentials(user, password)
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host, 5672, "/", credentials)
)

channel = connection.channel()


from lib.rabbitmq._publisher import send_message  # noqa

__all__ = ["channel", "send_message"]
>>>>>>> 14c449a (checkpoint)

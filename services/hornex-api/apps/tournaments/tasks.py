import time

from celery import shared_task


@shared_task
def ping():
    time.sleep(3)
    print("pong!")

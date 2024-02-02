import os

import django
from celery import Celery

# from celery.signals import worker_process_init

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
app = Celery("consumer_app", broker=os.getenv("CELERY_BROKER_URL"))

app.autodiscover_tasks()


@app.task
def test(arg):
    print(arg)


# @worker_process_init.connect
# def register_tasks(**kwargs):
#     from apps.tournaments.models import Tournament
#     from apps.tournaments.tasks import start_tournament

#     tournaments = Tournament.objects.all()
#     for tournament in tournaments:
#         logger.info("Scheduling task...", tournament=tournament)
#         start_tournament.apply_async(args=[tournament.id.__str__()], countdown=30)

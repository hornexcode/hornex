import os

import django
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
app = Celery("consumer_app", broker=os.getenv("CELERY_BROKER_URL"))

app.autodiscover_tasks()

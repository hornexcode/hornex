import os

import django
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
app = Celery("consumer_app", broker="pyamqp://guest@localhost//")

app.autodiscover_tasks()

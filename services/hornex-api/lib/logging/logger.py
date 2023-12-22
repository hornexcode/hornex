from django.conf import settings


def info(*args):
    if settings.TESTING:
        return
    print("\033[94m", *args, "\033[00m")


def warning(*args):
    if settings.TESTING:
        return
    print("\033[93m", *args, "\033[00m")


def success(*args):
    if settings.TESTING:
        return
    print("\033[92m", *args, "\033[00m")

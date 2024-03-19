from django.conf import settings


def experimental(func):
    def wrapper(*args, **kwargs):
        if settings.TESTING:
            return
        func(*args, **kwargs)

    return wrapper

from django.conf import settings


def experimental(func):
    def wrapper(*args, **kwargs):
        print("Experimental feature is enabled")
        if settings.TESTING:
            return
        func(*args, **kwargs)
        print("Code run successfully!")

    return wrapper

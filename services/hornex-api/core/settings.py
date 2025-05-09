import logging
import os
import sys
from datetime import timedelta
from pathlib import Path

import dotenv
import structlog

dotenv.load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

TESTING = "test" in sys.argv


def get_settings(name, default=None):
    return os.environ.get(name, default)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "changeme"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(int(os.getenv("DEBUG", "1")))

DEFAULT_ALLOWED_HOSTS = ["localhost"]
ALLOWED_HOSTS = DEFAULT_ALLOWED_HOSTS + os.getenv("DJANGO_ALLOWED_HOSTS", "").split(",")
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True  # dev only


CSRF_TRUSTED_ORIGINS = os.getenv(
    "DJANGO_CSRF_TRUSTED_ORIGINS", "http://localhost:8000"
).split(",")

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "drf_yasg",
    "channels",  # websockets
    "corsheaders",  # dev only
    "django_crontab",
    # "pkg.grpc.apps.GRPCConfig",  # grpc
    # "lib.rabbitmq.apps.RabbitmqConfig",  # rabbitmq
    # apps
    "apps.payments.apps.PaymentsConfig",
    "apps.users.apps.UsersConfig",
    "apps.teams.apps.TeamsConfig",
    "apps.tournaments.apps.TournamentsConfig",
    "apps.platforms.apps.PlatformsConfig",
    "apps.games.apps.GamesConfig",
    "apps.notifications.apps.NotificationsConfig",
    "apps.accounts.apps.AccountsConfig",
    "apps.configs.apps.ConfigsConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # dev only
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "lib/mail/templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.getenv("HORNEX_SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.getenv("HORNEX_SQL_DATABASE", BASE_DIR / "db.sqlite3"),
        "USER": os.getenv("HORNEX_SQL_USER", "user"),
        "PASSWORD": os.getenv("HORNEX_SQL_PASSWORD", "password"),
        "HOST": os.getenv("HORNEX_SQL_HOST", "localhost"),
        "PORT": os.getenv("HORNEX_SQL_PORT", "5432"),
    },
}
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CUSTOM

AUTH_USER_MODEL = "users.User"

# https://jpadilla.github.io/django-rest-framework-jwt/
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        # other authentication classes
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}

SIMPLE_JWT = {
    "JWT_SECRET_KEY": SECRET_KEY,
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "JWT_ALGORITHM": "HS256",
    "JWT_ALLOW_REFRESH": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "TOKEN_OBTAIN_SERIALIZER": "lib.jwt.serializers.HornexTokenObtainPairSerializer",
}

APPEND_SLASH = False

# THIRD PARTY KEYS
RIOT_API_KEY = "RGAPI-eda91699-6860-4fde-9ef8-d6ea815a9201"

ASGI_APPLICATION = "core.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    }
}


TOURNAMENT_TEAMS_LIMIT_POWER_NUMBER = 5

if TESTING:
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "null": {
                "level": "DEBUG",
                "class": "logging.NullHandler",
            },
        },
        "loggers": {
            "structlog": {
                "handlers": ["null"],
                "level": "DEBUG",
                "propagate": False,
            },
        },
    }
else:
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="%Y-%m-%d %H:%M:%S", utc=False),
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.NOTSET),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=False,
    )

    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json_formatter": {
                "()": structlog.stdlib.ProcessorFormatter,
                "processor": structlog.processors.JSONRenderer(),
            }
        },
        "handlers": {
            "console": {
                "level": "INFO",
                "class": "logging.StreamHandler",
                "formatter": "json_formatter",
            }
        },
        "loggers": {
            "root": {"handlers": ["console"], "level": "INFO", "propagate": False}
        },
    }

# CRONJOBS = [("*/1 * * * *", "apps.tournaments.cron.expire_stale_registration")]


def get_root_domain():
    # grab hostname from current site url
    # full_domain = urlparse(
    # get_settings("HORNEX_API_BASE_URL", "https://api.hornexcode.com")
    # ).hostname
    # only use the top level domain
    # root_domain = f"{'.'.join(full_domain.split('.')[-2:])}"
    return "hornexcode.com"


SESSION_COOKIE_DOMAIN = get_root_domain()

# RABBITMQ
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT", 5672)

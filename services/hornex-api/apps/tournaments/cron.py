import logging
from datetime import datetime as dt
from datetime import timedelta as td

from apps.tournaments.models import Registration

logger = logging.getLogger("django")


def expire_stale_registration():
    logging.info("Expiring stale registrations")
    stale_registrations = Registration.objects.filter(
        created_at__lt=dt.utcnow() - td(hour=1),
        status=Registration.RegistrationStatusType.PENDING,
    )
    stale_registrations.update(status=Registration.RegistrationStatusType.REJECTED)

import structlog

from apps.tournaments.tasks import (
    create_challonge_tournament,
)

logger = structlog.get_logger(__name__)


# @receiver(post_save, sender=Tournament)
def tournament_created(sender, instance, created, **kwargs):
    if created:
        logger.info("Creating Challonge Tournament...", tournament_id=instance.id)
        create_challonge_tournament(tournament_id=instance.id)

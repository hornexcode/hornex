import structlog
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.leagueoflegends.models import Tournament
from apps.tournaments.tasks import (
    create_challonge_tournament,
)

logger = structlog.get_logger(__name__)


@receiver(post_save, sender=Tournament)
def tournament_created(sender, instance, created, **kwargs):
    if created:
        create_challonge_tournament(tournament_id=instance.id)

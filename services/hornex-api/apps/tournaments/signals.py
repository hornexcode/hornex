import structlog

from apps.tournaments.models import Checkin, Registration
from apps.tournaments.tasks import (
    challonge_tournament_team_checkin_create,
    create_challonge_participant,
)

logger = structlog.get_logger(__name__)


# @receiver(post_save, sender=Checkin)
def checkin_created(sender, instance: Checkin, created, **kwargs):
    count = Checkin.objects.filter(tournament=instance.tournament, team=instance.team).count()
    if created and count == instance.tournament.max_teams:
        logger.info("Team full checked...")
        challonge_tournament_team_checkin_create(
            challonge_tournament_id=instance.tournament.challonge_tournament_id,
            team_id=instance.team.id,
        )


# @receiver(post_save, sender=Registration)
def registration_updated(sender, instance: Registration, created, **kwargs):
    if not created and instance.status == Registration.RegistrationStatusType.ACCEPTED:
        logger.info("Registration accepted...")
        create_challonge_participant(
            challonge_tournament_id=instance.tournament.challonge_tournament_id,
            team_id=str(instance.team.id),
            team_name=instance.team.name,
        )

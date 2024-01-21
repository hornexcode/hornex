import faker
import structlog
from django.core.management.base import BaseCommand

from apps.games.models import Game
from apps.users.models import User

fake = faker.Faker()

logger = structlog.get_logger(__name__)


class Command(BaseCommand):
    help = "Seed database with test data"

    def handle(self, *args, **options):
        create_superuser()
        create_games()


def create_superuser():
    logger.info("Creating admin superuser...")
    user = User.objects.create_superuser(
        email="admin@hornex.gg", name="Admin", password="admin"
    )
    logger.info("Admin superuser created!", email=user.email, password="admin")
    return user


def create_games():
    logger.info("Creating games...")
    Game.objects.create(
        name="League of Legends",
        slug="league-of-legends",
        description="League of Legends is a team-based game with over 140 champions to make epic plays with.",  # noqa
        thumbail_url="/static/images/games/league-of-legends.png",
    )
    logger.info("Games created!")

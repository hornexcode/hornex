import os
from datetime import datetime as dt
from datetime import timedelta as td
from datetime import timezone as tz

import faker
import structlog

os.environ["DJANGO_SETTINGS_MODULE"] = "core.settings"

import sys  # noqa: E402

sys.path.append("/src")  # for dev

import django  # noqa: E402

django.setup()

from apps.games.models import Game  # noqa: E402
from apps.leagueoflegends.models import LeagueEntry, Tournament  # noqa: E402
from apps.platforms.models import Platform  # noqa: E402
from apps.users.models import User  # noqa: E402

fake = faker.Faker()

logger = structlog.get_logger(__name__)


def create_superuser():
    logger.info("Creating admin superuser...")
    try:
        user = User.objects.create_superuser(
            email="admin@hornexcode.com", name="Admin", password="admin"
        )
        logger.info("Admin superuser created!", email=user.email, password="admin")
        return user
    except Exception:
        pass


def create_platforms():
    Platform.objects.all().delete()
    logger.info("Creating platforms...")
    Platform.objects.create(
        name="PC",
        slug="pc",
    )
    logger.info("Platforms created!")


def create_games():
    Game.objects.all().delete()
    logger.info("Creating games...")
    platform = Platform.objects.get(slug="pc")
    g = Game.objects.create(
        name="League of Legends",
        slug="league-of-legends",
        thumbnail_url="/static/images/games/league-of-legends.png",
    )
    g.platforms.add(platform)
    g.save()
    logger.info("Games created!")


def create_tournaments():
    logger.info("Creating tournaments...")
    now = dt.now(tz=tz.utc)  # noqa

    bronze_tier, _ = LeagueEntry.objects.get_or_create(
        tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
    )
    silver_tier, _ = LeagueEntry.objects.get_or_create(
        tier=LeagueEntry.TierOptions.SILVER, rank=LeagueEntry.RankOptions.I
    )
    t = Tournament.objects.create(
        name="Torneio do Hornex",
        description="Torneio de League of Legends do Hornex",
        game=Tournament.GameType.LEAGUE_OF_LEGENDS,
        organizer=User.objects.get(email="admin@hornexcode.com"),
        start_date=now + td(days=7),
        end_date=now + td(days=7, hours=2),
        start_time=now + td(days=7),
        end_time=now + td(days=7, hours=2),
        registration_start_date=now,
        registration_end_date=now + td(days=7),
        feature_image="/tmt-6.jpeg",
        is_public=True,  # change to is_published
        entry_fee=15,
        max_teams=32,
        team_size=5,
        is_prize_pool_fixed=False,
        is_classification_open=False,
    )
    t.allowed_league_entries.set([bronze_tier, silver_tier])


create_superuser()
create_platforms()
create_games()
# create_tournaments()

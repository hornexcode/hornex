#!/usr/bin/env python3
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

from apps.accounts.models import GameID  # noqa: E402
from apps.games.models import Game  # noqa: E402
from apps.platforms.models import Platform  # noqa: E402
from apps.teams.models import Team  # noqa: E402
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament  # noqa: E402
from apps.users.models import User  # noqa: E402

fake = faker.Faker()

logger = structlog.get_logger(__name__)


def create_superuser():
    logger.info("Creating admin superuser...")
    try:
        user = User.objects.create_superuser(
            email="admin@hornex.gg", name="Admin", password="admin"
        )
        GameID.objects.create(email=user.email, user=user)
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
    if Tournament.objects.count() > 0:
        return

    logger.info("Creating tournaments...")
    now = dt.now(tz=tz.utc)  # noqa

    Tournament.objects.create(
        name="Torneio do Hornex",
        description="Torneio de League of Legends do Hornex",
        game=Tournament.GameType.LEAGUE_OF_LEGENDS,
        organizer=User.objects.get(email="admin@hornex.gg"),
        start_date=now + td(days=7),
        end_date=now + td(days=14),
        start_time=now + td(days=7),
        end_time=now + td(days=14),
        check_in_duration=50,
        registration_start_date=now,
        feature_image="tmt-6.jpeg",
        published=True,  # change to is_published
        entry_fee=2000,
        max_teams=32,
        team_size=5,
        status=Tournament.StatusOptions.REGISTERING,
        prize_pool_enabled=True,
        open_classification=True,
        is_entry_free=False,
    )


def create_teams():
    Team.objects.all().delete()

    logger.info("Creating teams...")

    admin = User.objects.get(email="admin@hornex.gg")
    team = Team.objects.create(
        name="Hornex HX",
        description="Team 1 description",
        game=Team.GameType.LEAGUE_OF_LEGENDS,
        platform=Team.PlatformType.PC,
        created_by=admin,
    )

    for user in User.objects.exclude(email="admin@hornex.gg").all()[:4]:
        team.add_member(user, is_admin=False)

    logger.info("Teams created!")


create_superuser()
create_platforms()
create_games()
# create_teams()
create_tournaments()

import faker
from datetime import timezone as tz, datetime as dt, timedelta as td
from teams.models import Team
from users.models import User
from tournaments.models import Tournament
from tournaments.leagueoflegends.models import LeagueOfLegendsTournament


fake = faker.Faker()


class UserFactory:
    @staticmethod
    def new(**kwargs):
        return User.objects.create(
            email=kwargs.get("email", fake.email()),
            password=kwargs.get("password", "password"),
            name=kwargs.get("name", fake.name()),
        )


class TeamFactory:
    @staticmethod
    def new(created_by: User, **kwargs) -> Team:
        """
        Create a new team with the given owner and kwargs.

        :param owner: The owner of the team
        :param kwargs: The team fields
        :return: The created team
        """
        return Team.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Team description"),
            created_by=created_by,
            game=kwargs.get("game", Team.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Team.PlatformType.PC),
        )


class TournamentFactory:
    @staticmethod
    def new(organizer: User, **kwargs):
        """
        Create a new tournament with the given organizer and kwargs.
        """
        now = dt.now(tz=tz.utc)
        return Tournament.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Tournament description"),
            organizer=organizer,
            game=kwargs.get("game", Tournament.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Tournament.PlatformType.PC),
            is_public=kwargs.get("is_public", True),
            status=kwargs.get("status", Tournament.TournamentStatusType.NOT_STARTED),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            end_date=kwargs.get("end_date", now + td(days=30)),
            start_time=kwargs.get("start_time", now + td(hours=15)),
            end_time=kwargs.get("end_time", now + td(hours=18)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            is_prize_pool_fixed=kwargs.get("is_prize_pool_fixed", True),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
        )


class LeagueOfLegendsTournamentFactory:
    @staticmethod
    def new(organizer: User, **kwargs):
        """
        Create a new tournament with the given organizer and kwargs.
        """
        now = dt.now(tz=tz.utc)
        return LeagueOfLegendsTournament.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Tournament description"),
            organizer=organizer,
            game=kwargs.get("game", Tournament.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Tournament.PlatformType.PC),
            is_public=kwargs.get("is_public", True),
            status=kwargs.get("status", Tournament.TournamentStatusType.NOT_STARTED),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            end_date=kwargs.get("end_date", now + td(days=30)),
            start_time=kwargs.get("start_time", now + td(hours=15)),
            end_time=kwargs.get("end_time", now + td(hours=18)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            is_prize_pool_fixed=kwargs.get("is_prize_pool_fixed", True),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
        )

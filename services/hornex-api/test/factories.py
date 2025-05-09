import uuid
from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td

import faker

from apps.accounts.models import GameID, LeagueOfLegendsSummoner
from apps.teams.models import Invite, Team
from apps.tournaments.models import LeagueOfLegendsLeague, Match, Registration
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Tournament as BaseTournament
from apps.users.models import User

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
    def new(created_by=None, **kwargs) -> Team:
        """
        Create a new team with the given owner and kwargs.

        :param owner: The owner of the team
        :param kwargs: The team fields
        :return: The created team
        """
        if created_by is None:
            created_by = UserFactory.new()

        return Team.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Team description"),
            created_by=created_by,
            game=kwargs.get("game", Team.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Team.PlatformType.PC),
        )


class InviteFactory:
    @staticmethod
    def new(team: Team | None = None, **kwargs) -> Invite:
        """
        Create a new invite with the given kwargs.
        """

        if team is None:
            team = TeamFactory.new()

        return Invite.objects.create(team=team, user=kwargs.get("user"))


class TournamentFactory:
    @staticmethod
    def new(organizer: User, **kwargs):
        """
        Create a new tournament with the given organizer and kwargs.
        """
        now = dt.now(tz=UTC)
        return BaseTournament.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Tournament description"),
            organizer=organizer,
            game=kwargs.get("game", BaseTournament.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", BaseTournament.PlatformType.PC),
            published=kwargs.get("published", True),
            status=kwargs.get("status", BaseTournament.StatusOptions.REGISTERING),
            registration_start_date=kwargs.get("registration_start_date", now),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            start_time=kwargs.get("start_time", now + td(hours=15)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
        )


class LeagueOfLegendsTournamentFactory:
    @staticmethod
    def new(organizer: User, allowed_league_entries=None, **kwargs):
        """
        Create a new league of legends tournament with the given organizer and kwargs.
        """
        now = dt.now(tz=UTC)
        tmt = Tournament.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Tournament description"),
            organizer=organizer,
            game=kwargs.get("game", Tournament.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Tournament.PlatformType.PC),
            published=kwargs.get("published", True),
            status=kwargs.get("status", Tournament.StatusOptions.REGISTERING),
            registration_start_date=kwargs.get("registration_start_date", now),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            check_in_duration=15,
            start_time=kwargs.get("start_time", now + td(hours=15)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
            open_classification=True,
            challonge_tournament_id=kwargs.get("challonge_tournament_id", 1),
        )

        if allowed_league_entries is not None:
            tmt.classifications.set(allowed_league_entries)

        return tmt


class LeagueEntryFactory:
    @staticmethod
    def new(**kwargs):
        """
        Create a new LeagueEntry with the given kwargs.
        """
        return LeagueOfLegendsLeague.objects.create(
            tier=kwargs.get("name", LeagueOfLegendsLeague.TierOptions.SILVER),
            rank=kwargs.get("rank", LeagueOfLegendsLeague.RankOptions.I),
        )


class MatchFactory:
    @staticmethod
    def new(tournament: Tournament, **kwargs):
        """
        Create a new match with the given kwargs.
        """
        user_a = UserFactory.new()
        user_b = UserFactory.new()
        team_a = TeamFactory.new(user_a)
        team_b = TeamFactory.new(user_b)

        return Match.objects.create(
            tournament=tournament,
            round=kwargs.get("round", 1),
            team_a=kwargs.get("team_a", team_a),
            team_b=kwargs.get("team_b", team_b),
            winner=kwargs.get("winner"),
            loser=kwargs.get("loser"),
            status=kwargs.get("status", Match.StatusType.SCHEDULED),
            challonge_match_id=kwargs.get("challonge_match_id", 1),
        )


class GameIdFactory:
    @staticmethod
    def new(**kwargs):
        """
        Create a new GameId with the given kwargs.
        """
        user = kwargs.get("user", UserFactory.new())

        return GameID.objects.create(
            user=user,
            game=kwargs.get("game", GameID.GameOptions.LEAGUE_OF_LEGENDS),
            nickname=fake.name(),
            is_active=kwargs.get("is_active", True),
            metadata={
                "puuid": str(uuid.uuid4()),
            },
        )


class RegistrationFactory:
    @staticmethod
    def new(team: Team, tournament: Tournament, challonge_participant_id: int):
        """
        Create a new Registration with the given params.
        """
        return Registration.objects.create(
            team=team,
            tournament=tournament,
            challonge_participant_id=challonge_participant_id,
            platform_slug="pc",
            game_slug="league-of-legends",
        )


class LeagueOfLegendsSummonerFactory:
    @staticmethod
    def new(game_id: GameID, **kwargs):
        """
        Create a new Registration with the given params.
        """
        return LeagueOfLegendsSummoner.objects.create(
            id=kwargs.get("id", str(uuid.uuid4())),
            game_id=game_id,
            puuid=kwargs.get("puuid", str(uuid.uuid4())),
            name=kwargs.get("name", fake.name()),
        )

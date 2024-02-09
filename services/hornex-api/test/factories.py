from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td

import faker

from apps.leagueoflegends.models import (
    GameID,
    LeagueEntry,
    Provider,
    Tournament,
)
from apps.teams.models import Invite, Team
from apps.tournaments.models import Match
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
    def new(created_by: User | None = None, **kwargs) -> Team:
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
            is_public=kwargs.get("is_public", True),
            phase=kwargs.get("phase", BaseTournament.PhaseType.REGISTRATION_OPEN),
            registration_start_date=kwargs.get("registration_start_date", now),
            registration_end_date=kwargs.get("registration_end_date", now + td(days=7)),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            end_date=kwargs.get("end_date", now + td(days=30)),
            start_time=kwargs.get("start_time", now + td(hours=15)),
            end_time=kwargs.get("end_time", now + td(hours=18)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            # is_prize_pool_fixed=kwargs.get("is_prize_pool_fixed", True),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
        )


class LeagueOfLegendsTournamentFactory:
    @staticmethod
    def new(organizer: User, allowed_league_entries=None, **kwargs):
        """
        Create a new league of legends tournament with the given organizer and kwargs.
        """
        default_provider = Provider.objects.create(id=1, region="BR", url="https://www.hornex.gg/")

        now = dt.now(tz=UTC)
        tmt = Tournament.objects.create(
            name=kwargs.get("name", fake.name()),
            description=kwargs.get("description", "Tournament description"),
            organizer=organizer,
            game=kwargs.get("game", Tournament.GameType.LEAGUE_OF_LEGENDS),
            platform=kwargs.get("platform", Tournament.PlatformType.PC),
            is_public=kwargs.get("is_public", True),
            phase=kwargs.get("phase", Tournament.PhaseType.REGISTRATION_OPEN),
            registration_start_date=kwargs.get("registration_start_date", now),
            registration_end_date=kwargs.get("registration_end_date", now + td(days=7)),
            start_date=kwargs.get(
                "start_date",
                now + td(days=15),
            ),
            end_date=kwargs.get("end_date", now + td(days=30)),
            start_time=kwargs.get("start_time", now + td(hours=15)),
            end_time=kwargs.get("end_time", now + td(hours=18)),
            feature_image=kwargs.get("feature_image", "https://fakeimg.pl/300/"),
            is_entry_free=kwargs.get("is_entry_free", False),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
            provider=kwargs.get("provider", default_provider),
            pick=kwargs.get("pick", Tournament.PickType.DRAFT_MODE),
            map=kwargs.get("map", Tournament.MapType.HOWLING_ABYSS),
            spectator=kwargs.get("spectator", Tournament.SpectatorType.ALL),
        )

        if not allowed_league_entries:
            allowed_league_entries = LeagueEntryFactory.new()
        if not isinstance(allowed_league_entries, list):
            allowed_league_entries = [allowed_league_entries]
        tmt.allowed_league_entries.set(allowed_league_entries)

        return tmt


class LeagueEntryFactory:
    @staticmethod
    def new(**kwargs):
        """
        Create a new LeagueEntry with the given kwargs.
        """
        return LeagueEntry.objects.create(
            tier=kwargs.get("name", LeagueEntry.TierOptions.SILVER),
            rank=kwargs.get("rank", LeagueEntry.RankOptions.I),
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
            team_a_id=kwargs.get("team_a_id", team_a.id),
            team_b_id=kwargs.get("team_b_id", team_b.id),
            winner_id=kwargs.get("winner_id"),
            loser_id=kwargs.get("loser_id"),
            is_wo=kwargs.get("is_wo", False),
            status=kwargs.get("status", Match.StatusType.FUTURE),
        )


class GameIdFactory:
    @staticmethod
    def new(user: User, **kwargs):
        """
        Create a new GameId with the given kwargs.
        """

        return GameID.objects.create(
            user=user,
            game=kwargs.get("game", GameID.GameOptions.LEAGUE_OF_LEGENDS),
            nickname=fake.name(),
            is_active=kwargs.get("is_active", True),
            region=kwargs.get("region", "BR"),
            region_code=kwargs.get("region_code", "BR"),
        )

import faker
from datetime import timezone as tz, datetime as dt, timedelta as td
from apps.teams.models import Team, Invite
from apps.users.models import User
from apps.tournaments.models import Tournament, Round, Match
from apps.tournaments.leagueoflegends.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
    Tier,
)
from apps.accounts.models import LeagueOfLegendsAccount

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
        now = dt.now(tz=tz.utc)
        return Tournament.objects.create(
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
            is_prize_pool_fixed=kwargs.get("is_prize_pool_fixed", True),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
        )


class LeagueOfLegendsTournamentFactory:
    @staticmethod
    def new(organizer: User, classification=None, **kwargs):
        """
        Create a new league of legends tournament with the given organizer and kwargs.
        """
        default_provider = LeagueOfLegendsTournamentProvider.objects.create(
            id=1, region="BR", url="https://www.hornex.gg/"
        )

        if classification is not None and isinstance(classification, Tier):
            classification = [classification]

        now = dt.now(tz=tz.utc)
        tmt = LeagueOfLegendsTournament.objects.create(
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
            is_prize_pool_fixed=kwargs.get("is_prize_pool_fixed", True),
            prize_pool=kwargs.get("prize_pool", 999),
            max_teams=kwargs.get("max_teams", 32),
            team_size=kwargs.get("team_size", 5),
            provider=kwargs.get("provider", default_provider),
            pick=kwargs.get("pick", LeagueOfLegendsTournament.PickType.DRAFT_MODE),
            map=kwargs.get("map", LeagueOfLegendsTournament.MapType.HOWLING_ABYSS),
            spectator=kwargs.get(
                "spectator", LeagueOfLegendsTournament.SpectatorType.ALL
            ),
        )

        tmt.tiers.set(classification) if classification is not None else None
        return tmt


class TierFactory:
    @staticmethod
    def new(**kwargs):
        """
        Create a new tier with the given kwargs.
        """
        return Tier.objects.create(
            name=kwargs.get("name", fake.name()),
        )


class LeagueOfLegendsAccountFactory:
    @staticmethod
    def new(user: User, **kwargs):
        """
        Create a new league of legends account with the given kwargs.
        """
        tier = kwargs.get("tier")
        return LeagueOfLegendsAccount.objects.create(
            summoner_id=kwargs.get("summoner_id", fake.name()),
            account_id=kwargs.get("account_id", fake.name()),
            puuid=kwargs.get("puuid", fake.name()),
            summoner_name=kwargs.get("summoner_name", fake.name()),
            profile_icon_id=kwargs.get("profile_icon_id", 123),
            revision_date=kwargs.get("revision_date", 123),
            summoner_level=kwargs.get("summoner_level", 123),
            sub=kwargs.get("sub", fake.name()),
            jti=kwargs.get("jti", fake.name()),
            tag_line=kwargs.get("jti", LeagueOfLegendsAccount.TagLineType.BR1),
            user=user,
            tier=tier if tier is not None else TierFactory.new(),
        )


class RoundFactory:
    @staticmethod
    def new(tournament: LeagueOfLegendsTournament, **kwargs):
        """
        Create a new round with the given kwargs.
        """
        return Round.objects.create(
            tournament=tournament,
            name=kwargs.get("name", f"Round | {fake.name()}"),
            key=tournament._get_key(),
        )


class MatchFactory:
    @staticmethod
    def new(tournament: LeagueOfLegendsTournament, **kwargs):
        """
        Create a new match with the given kwargs.
        """
        user_a = UserFactory.new()
        user_b = UserFactory.new()
        team_a = TeamFactory.new(user_a)
        team_b = TeamFactory.new(user_b)
        round = RoundFactory.new(tournament)

        return Match.objects.create(
            tournament=tournament,
            team_a_id=kwargs.get("team_a_id", team_a.id),
            team_b_id=kwargs.get("team_b_id", team_b.id),
            round=kwargs.get("round", round),
            winner_id=kwargs.get("winner_id"),
            loser_id=kwargs.get("loser_id"),
            is_wo=kwargs.get("is_wo", False),
            status=kwargs.get("status", Match.StatusType.FUTURE),
        )

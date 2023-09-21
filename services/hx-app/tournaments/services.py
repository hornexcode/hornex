from django.conf import settings
from tournaments.models import (
    Tournament,
    LeagueOfLegendsTournament,
    TournamentRegistration,
    TournamentTeam,
    Bracket,
)
from teams.models import Team, TeamMember
from users.models import User
from games.models import GameAccountRiot
from django.utils import timezone
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.db import transaction
from tournaments.leagueoflegends.tasks import register_tournament
from tournaments.events import TournamentCreated
from services.riot.client import new_riot_client


def get_riot_client():
    return new_riot_client(settings.RIOT_API_KEY)


class TournamentManagementService:
    def register(
        self, team_id: str, tournament_id: str, user_id: str
    ) -> TournamentRegistration:
        team, tournament, user = None, None, None

        team = Team.objects.get(id=team_id)
        tournament = Tournament.objects.get(id=tournament_id)
        user = User.objects.get(id=user_id)

        # check if tournament is open
        if (
            tournament.status != Tournament.TournamentStatusType.NOT_STARTED
            or tournament.end_time < timezone.now()
        ):
            raise Exception("Tournament has started or finished.")

        # check if tournament is full
        if (
            tournament.max_teams
            <= TournamentTeam.objects.filter(tournament=tournament).count()
        ):
            raise Exception("Tournament is full.")

        # check if team is already registered
        if TournamentRegistration.objects.filter(
            tournament=tournament, team=team, cancelled_at__isnull=True
        ).exists():
            raise Exception("Team is already registered.")

        # check if user is the team admin
        if not TeamMember.objects.filter(team=team, user=user, is_admin=True).exists():
            raise Exception("Only team admin can register for a tournament.")

        if tournament.game != team.game:
            raise Exception("Team's game does not match tournament's game.")

        if tournament.platform != team.platform:
            raise Exception("Team's platform does not match tournament's platform.")

        if team.members.count() != tournament.team_size:
            raise Exception("Team's size does not match tournament requirements.")

        members = team.members.all()

        for member in members:
            if tournament.game.slug == "league-of-legends":
                lol_tournament = LeagueOfLegendsTournament.objects.get(id=tournament.id)
                riot_client = get_riot_client()

                try:
                    member_riot_account = GameAccountRiot.objects.get(
                        user__id=member.id
                    )
                except ObjectDoesNotExist as e:
                    raise ObjectDoesNotExist(
                        f"Could not find {member.name} riot account."
                    )

                member_riot_account.renew_data(
                    riot_client.get_a_summoner_by_summoner_name
                )
                member_riot_account.refresh_from_db()

                leagues = riot_client.get_league_by_summoner_id(
                    member_riot_account.encrypted_summoner_id,
                    member_riot_account.region,
                )

                for league in leagues:
                    if league["tier"] != lol_tournament.tier:
                        raise Exception(
                            f"{member.name}'s tier does not match tournament tier."
                        )

        return TournamentRegistration.objects.create(team=team, tournament=tournament)

    @transaction.atomic
    def confirm_registration(self, tournament_registration: TournamentRegistration):
        tournament = tournament_registration.tournament
        team = tournament_registration.team

        # check if team is already at tournament
        if TournamentTeam.objects.filter(team=team, tournament=tournament).exists():
            raise Exception("Team is already at tournament.")

        # check if tournament is full
        if (
            tournament.max_teams
            <= TournamentTeam.objects.filter(tournament=tournament).count()
        ):
            raise Exception("Tournament is full.")

        # check if tournament is open
        if (
            tournament.status != Tournament.TournamentStatusType.NOT_STARTED
            or tournament.end_time < timezone.now()
        ):
            raise Exception("Tournament has started or finished.")

        tournament_team = TournamentTeam.objects.create(
            team=team, tournament=tournament
        )

        if not tournament_team:
            raise Exception("Could not confirm registration.")

        tournament_registration.confirmed_at = timezone.now()
        tournament_registration.save()

        try:
            event = TournamentCreated(
                tournament_id=tournament.id,
                tournament_team_id=tournament_team.id,
                team_id=team.id,
                game_slug=tournament.game.slug,
            )
            tournament_created(event)
        except Exception as e:
            print(e)
            raise Exception("Could not confirm registration.") from e

    def cancel_registration(self, registration_id: int, user_id: int):
        user = User.objects.get(id=user_id)
        registration = TournamentRegistration.objects.get(id=registration_id)

        if not TeamMember.objects.filter(
            team=registration.team, user=user, is_admin=True
        ).exists():
            raise PermissionDenied("Only team admin can cancel registration.")

        registration.cancelled_at = timezone.now()
        registration.save()

    def unregister(self, registration_id: int, user_id: int):
        user = User.objects.get(id=user_id)
        registration = TournamentRegistration.objects.get(id=registration_id)

        # check if team member is
        if not TeamMember.objects.filter(
            team=registration.team, user=user, is_admin=True
        ).exists():
            raise PermissionDenied("Only team admin can unregister from a tournament.")

        # not registered
        if not registration.confirmed_at:
            raise Exception("The team is not confirmed at tournament")

        # We've confirmed_at, but TournamentTeam is null, "Internal error" will be 404
        TournamentTeam.objects.get(
            team=registration.team, tournament=registration.tournament
        )

        registration.cancelled_at = timezone.now()
        registration.save()

    @transaction.atomic
    def generate_brackets(self, tournament: Tournament) -> None:
        # Validate if tournament has started
        if tournament.status != Tournament.TournamentStatusType.NOT_STARTED:
            raise Exception("This tournament has already started.")

        participants = tournament.max_teams

        # Validate tournament if participants are the power of 2
        if not participants or participants & (participants - 1) != 0:
            raise Exception("Participants should be a power of 2.")

        tournament_teams = TournamentTeam.objects.filter(tournament=tournament)

        # Validate if TournamentTeam is enough
        if tournament_teams.count() != participants:
            raise Exception("Tournament doesn't have enough registered teams.")

        # Get rounds quantity
        rounds = int(participants.bit_length()) - 1

        # The remaining rounds will have empty brackets
        for i in range(rounds):
            for j in range(participants // 2):
                # First round brackets will have teams
                if i == 0:
                    Bracket.objects.create(
                        tournament=tournament,
                        team_a=tournament_teams[j].team,
                        team_b=tournament_teams[j + 1].team,
                        round=i + 1,
                    )
                # Empty brackets for next rounds
                else:
                    Bracket.objects.create(tournament=tournament, round=i + 1)

            participants //= 2

        tournament.status = Tournament.TournamentStatusType.STARTED
        tournament.save()


def tournament_created(
    event: TournamentCreated,
):
    """Controller for producing TournamentRegistrationConfirmed event."""
    # Ideally, this use case should not be called right after a tournament
    # is created. Will be better calling after a tournament is about to start
    # and has enough teams.
    if event.game_slug == Tournament.GameType.LEAGUE_OF_LEGENDS:
        register_tournament.delay(event)

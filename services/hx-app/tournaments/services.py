from tournaments.models import Tournament, TournamentRegistration, TournamentTeam
from teams.models import Team, TeamMember
from users.models import User
from django.utils import timezone
from django.core.exceptions import BadRequest, PermissionDenied


class TournamentService:
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
            team=team, cancelled_at__isnull=True
        ).exists():
            raise Exception("Team is already registered.")

        # check if user is the team admin
        if not TeamMember.objects.filter(team=team, user=user, is_admin=True).exists():
            raise Exception("Only team admin can register for a tournament.")

        return TournamentRegistration.objects.create(team=team, tournament=tournament)

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

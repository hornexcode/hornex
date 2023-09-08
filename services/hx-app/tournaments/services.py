from tournaments.models import Tournament, TournamentRegistration
from teams.models import Team, TeamMember
from users.models import User
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist


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
            <= TournamentRegistration.objects.filter(
                team=team, tournament=tournament
            ).count()
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

    def confirm_registration():
        pass

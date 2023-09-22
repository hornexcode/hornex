# Integration tests
from tournaments.admin import TournamentRegistrationAdmin
from tournaments.models import TournamentRegistration, TournamentTeam
from teams.models import Team


class TestTournamentAdmin:
    def test_accept_tournament_registration(self):
        TournamentRegistrationAdmin.accept_team_registration(
            self,
            request=None,
            queryset=TournamentRegistration.objects.filter(
                id=self.tournament_registration.id
            ),
        )

        self.tournament_registration.refresh_from_db()

        self.assertIsNotNone(
            TournamentTeam.objects.filter(
                tournament=self.tournament_registration.tournament,
                team=self.tournament_registration.team,
            ).first()
        )
        self.assertIsNotNone(self.tournament_registration.confirmed_at)

    def test_accept_multiple_tournament_registrations(self):
        # Create second registration
        team = Team.objects.create(
            name="test team second",
            created_by=self.user,
            game=self.game,
            platform=self.platform,
        )

        tournament_registration = TournamentRegistration.objects.create(
            tournament=self.tournament, team=team
        )

        TournamentRegistrationAdmin.accept_team_registration(
            self,
            request=None,
            queryset=TournamentRegistration.objects.filter(
                id__in=[self.tournament_registration.id, tournament_registration.id]
            ),
        )

        # Refresh registrations after accepting
        self.tournament_registration.refresh_from_db()
        tournament_registration.refresh_from_db()

        tournament_teams = TournamentTeam.objects.filter(
            tournament=self.tournament_registration.tournament,
        ).all()

        self.assertEqual(len(tournament_teams), 2)
        self.assertIsNotNone(self.tournament_registration.confirmed_at)
        self.assertIsNotNone(tournament_registration.confirmed_at)

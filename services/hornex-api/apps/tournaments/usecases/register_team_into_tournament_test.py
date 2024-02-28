from test.factories import GameIdFactory, LeagueOfLegendsTournamentFactory, TeamFactory, UserFactory
from unittest.mock import patch

import faker
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.teams.models import Team
from apps.users.models import User
from lib.challonge._tournament import Participant

fake = faker.Faker()


class RegisterTeamIntoTournamentTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("/tournaments", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.game_id = GameIdFactory.new(user=self.user, email=self.user.email)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    @patch("lib.challonge.Tournament.add_team")
    def test_register_team_into_tournament(self, mock_add_team):
        participant = Participant()
        participant.id = 123
        mock_add_team.return_value = participant

        self.tournament.challonge_tournament_id = 123
        self.tournament.save()
        self.tournament.refresh_from_db()

        users = [UserFactory.new() for i in range(4)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        team = TeamFactory.new(name=name, created_by=self.user)
        [team.add_member(game_id=game_id) for game_id in [*game_ids, self.game_id]]

        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {
                "team_id": team.id,
            },
        )

        print("@RESP", resp.json())
        team = resp.json()

        mock_add_team.assert_called_once()
        self.assertEqual(team.get("name"), name)
        self.assertEqual(team.get("created_by"), str(self.user.id))
        team = Team.objects.get(id=team.get("id"))
        for game_id in game_ids:
            self.assertIn(game_id, team.members.all())

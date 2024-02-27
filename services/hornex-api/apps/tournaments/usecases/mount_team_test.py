from test.factories import GameIdFactory, LeagueOfLegendsTournamentFactory, TeamFactory, UserFactory

import faker
from django.test import TestCase
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework.validators import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.teams.models import Team
from apps.tournaments.usecases import MountTeamInput, MountTeamUseCase
from apps.users.models import User

fake = faker.Faker()


class MountTeamUseCaseTest(TestCase):
    def setUp(self) -> None:
        self.credentials = {
            "email": "admin@hornex.gg",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)
        self.game_id = GameIdFactory.new(user=self.user, email=self.user.email)

    def test_mount_team(self):
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        params = MountTeamInput(user_id=self.user.id, name=fake.name(), **users_payload)
        output = MountTeamUseCase().execute(params)

        self.assertEqual(output.team.name, params.name)
        self.assertEqual(output.team.created_by, self.user)

    def test_team_already_exist(self):
        TeamFactory.new(name="Testeam")
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        params = MountTeamInput(user_id=self.user.id, name="Testeam", **users_payload)

        try:
            MountTeamUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Team name already in use")

    def test_mount_team_user_does_not_exist(self):
        users = [UserFactory.new() for i in range(3)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        users_payload["member_4_email"] = "fake@email.com"

        params = MountTeamInput(user_id=self.user.id, name=fake.name(), **users_payload)

        try:
            MountTeamUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                "User not found for fake@email.com",
            )

    def test_mount_team_user_does_not_have_game_id(self):
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        user = users.pop()
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        params = MountTeamInput(user_id=self.user.id, name=fake.name(), **users_payload)

        try:
            MountTeamUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                f"User {user.email} does not connected its account with League Of Legends",
            )


class TestMountTeam(APITestCase, URLPatternsTestCase):
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

    def test_mount_team(self):
        users = [UserFactory.new() for i in range(4)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}

        url = reverse("tournaments:team-mount", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        team = resp.json()

        self.assertEqual(team.get("name"), name)
        self.assertEqual(team.get("created_by"), str(self.user.id))
        team = Team.objects.get(id=team.get("id"))
        for game_id in game_ids:
            self.assertIn(game_id, team.members.all())

    def test_mount_team_team_already_exist(self):
        name = "Drakx"
        TeamFactory.new(name=name, created_by=self.user)
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        url = reverse("tournaments:team-mount", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        data = resp.json()
        print("@RESP", resp, data)

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(data.get("error"), "Team name already in use")

    def test_mount_team_user_not_found(self):
        name = "Drakx"
        users = [UserFactory.new() for i in range(3)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        users_payload["member_4_email"] = "fake@email.com"

        url = reverse("tournaments:team-mount", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(data.get("error"), "User not found for fake@email.com")

    def test_mount_team_user_does_not_have_game_id(self):
        name = "Drakx"
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        user = users.pop()
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        url = reverse("tournaments:team-mount", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            data.get("error"),
            f"User {user.email} does not connected its account with League Of Legends",
        )

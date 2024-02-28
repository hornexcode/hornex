from test.factories import GameIdFactory, TeamFactory, UserFactory

import faker
from django.test import TestCase
from rest_framework.validators import ValidationError

from apps.tournaments.usecases import (
    CreateAndRegisterTeamIntoTournamentInput,
    CreateAndRegisterTeamIntoTournamentUseCase,
)
from apps.users.models import User

fake = faker.Faker()


class CreateAndRegisterTeamIntoTournamentUseCaseTest(TestCase):
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

        params = CreateAndRegisterTeamIntoTournamentInput(
            user_id=self.user.id, name=fake.name(), **users_payload
        )
        output = CreateAndRegisterTeamIntoTournamentUseCase().execute(params)

        self.assertEqual(output.team.name, params.name)
        self.assertEqual(output.team.created_by, self.user)

    def test_team_already_exist(self):
        TeamFactory.new(name="Testeam")
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        params = CreateAndRegisterTeamIntoTournamentInput(
            user_id=self.user.id, name="Testeam", **users_payload
        )

        try:
            CreateAndRegisterTeamIntoTournamentUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Team name already in use")

    def test_mount_team_user_does_not_exist(self):
        users = [UserFactory.new() for i in range(3)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        users_payload["member_4_email"] = "fake@email.com"

        params = CreateAndRegisterTeamIntoTournamentInput(
            user_id=self.user.id, name=fake.name(), **users_payload
        )

        try:
            CreateAndRegisterTeamIntoTournamentUseCase().execute(params)
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

        params = CreateAndRegisterTeamIntoTournamentInput(
            user_id=self.user.id, name=fake.name(), **users_payload
        )

        try:
            CreateAndRegisterTeamIntoTournamentUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(
                str(e.detail["error"]),
                f"User {user.email} does not connected its account with League Of Legends",
            )

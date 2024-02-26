from test.factories import TeamFactory, UserFactory

import faker
from django.test import TestCase
from rest_framework.validators import ValidationError

from apps.accounts.models import GameID
from apps.teams.usecases import MountTeamInput, MountTeamUseCase
from apps.users.models import User

fake = faker.Faker()


class MountTeamUseCaseTest(TestCase):
    def setUp(self) -> None:
        self.credentials = {
            "email": "admin@hornex.gg",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

    def test_mount_team(self):
        params = MountTeamInput(
            user_id=self.user.id,
            name=fake.name(),
            member_1_email=fake.email(),
            member_2_email=fake.email(),
            member_3_email=fake.email(),
            member_4_email=fake.email(),
        )
        output = MountTeamUseCase().execute(params)

        self.assertEqual(output.team.name, params.name)
        self.assertEqual(output.team.created_by, self.user)
        self.assertEqual(GameID.objects.all().count(), 5)

    def test_team_already_exist(self):
        TeamFactory.new(name="Testeam")

        params = MountTeamInput(
            user_id=self.user.id,
            name="Testeam",
            member_1_email=fake.email(),
            member_2_email=fake.email(),
            member_3_email=fake.email(),
            member_4_email=fake.email(),
        )

        try:
            MountTeamUseCase().execute(params)
        except ValidationError as e:
            self.assertEqual(str(e.detail["error"]), "Team name already in use")

    def test_mount_team_existing_users(self):
        member = UserFactory.new()
        params = MountTeamInput(
            user_id=self.user.id,
            name=fake.name(),
            member_1_email=member.email,
            member_2_email=fake.email(),
            member_3_email=fake.email(),
            member_4_email=fake.email(),
        )
        output = MountTeamUseCase().execute(params)

        self.assertEqual(output.team.name, params.name)
        self.assertEqual(output.team.created_by, self.user)
        self.assertEqual(GameID.objects.all().count(), 5)

    def test_mount_team_existing_game_id(self):
        member = UserFactory.new()
        GameID.objects.create(email=member.email, user=member)

        params = MountTeamInput(
            user_id=self.user.id,
            name=fake.name(),
            member_1_email=member.email,
            member_2_email=fake.email(),
            member_3_email=fake.email(),
            member_4_email=fake.email(),
        )
        output = MountTeamUseCase().execute(params)

        self.assertEqual(output.team.name, params.name)
        self.assertEqual(output.team.created_by, self.user)
        self.assertEqual(GameID.objects.all().count(), 5)

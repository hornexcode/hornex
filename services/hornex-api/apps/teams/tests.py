import uuid
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User
from apps.teams.models import Team, Membership
from test.factories import TeamFactory, InviteFactory, UserFactory

prefix = "api/v1/<str:platform>/<str:game>"


class TestTeam(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"{prefix}/teams", include("apps.teams.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        self.platform = Team.PlatformType.PC
        self.game = Team.GameType.LEAGUE_OF_LEGENDS

    def test_create_team_201_success(self):
        """
        Ensure we can create a new team object.
        """

        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )

        resp = self.client.post(
            url,
            {"name": "Test team", "description": "Just a test description"},
        )

        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Team.objects.count(), 1)

    def test_create_team_401_unauthorized_error(self):
        """
        Ensure we can't create a new team object without authentication.
        """

        self.client.credentials()
        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )
        resp = self.client.post(
            url,
            {"name": "test team", "game": self.game, "platform": self.platform},
        )

        self.assertEqual(resp.status_code, 401)

    def test_create_team_400_bad_request_error(self):
        """
        Ensure we can't create a new team object with a missing field.
        """

        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )
        resp = self.client.post(
            url,
            {"platform": "mobile"},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(Team.objects.count(), 0)

    def test_list_teams_200(self):
        """
        Ensure we can list teams.
        """

        Team.objects.create(
            name="test team 1",
            created_by=self.user,
        )

        url = reverse(
            "team-list",
            kwargs={
                "platform": self.platform,
                "game": self.game,
            },
        )
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.json()), 1)

        # # When it returns an empty list
        # url = reverse(
        #     "team-list",
        #     kwargs={
        #         "platform": "fake-platform-slug",
        #         "game": "fake-game-slug",
        #     },
        # )

        # resp = self.client.get(url)

        # self.assertEqual(resp.status_code, 200)
        # self.assertEqual(len(resp.json()), 0)


class TestInvites(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"/invites", include("apps.teams.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        self.platform = Team.PlatformType.PC
        self.game = Team.GameType.LEAGUE_OF_LEGENDS

        self.team_owner = UserFactory.new()
        self.team = TeamFactory.new(self.team_owner)

        self.invite = InviteFactory.new(self.team, user=self.user)

    def test_accept_invite_200(self):
        """
        Ensure an logged user can accept a team invite.
        """

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.invite.refresh_from_db()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(self.invite.accepted_at)
        self.assertEqual(Membership.objects.count(), 2)

    def test_accept_invite_not_found_404(self):
        """
        Ensure invalid team invite can not be accepted.
        """

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": uuid.uuid4()},
        )

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.data.get("message"), "Not found.")

    def test_accept_invite_unauthenticated_403(self):
        """
        Ensure an unauthenticated user can not accept a team invite.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer invalid-token")

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 401)

    def test_accept_invite_accepted_400(self):
        """
        Ensure user can not accept already accepted invite.
        """

        self.invite.accept()

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has been accepted.")

    def test_accept_invite_declined_400(self):
        """
        Ensure user can not accept already declined invite.
        """

        self.invite.decline()

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has been declined.")

    def test_accept_invite_expired_400(self):
        """
        Ensure user can not accept already expired invite.
        """

        self.invite.expire()

        url = reverse(
            "invite-accept",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has expired.")

    def test_decline_invite_200(self):
        """
        Ensure an logged user can decline a team invite.
        """

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.invite.refresh_from_db()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(self.invite.declined_at)
        self.assertEqual(Membership.objects.count(), 1)

    def test_decline_invite_not_found_404(self):
        """
        Ensure invalid team invite can not be declined.
        """

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": uuid.uuid4()},
        )

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.data.get("message"), "Not found.")

    def test_decline_invite_unauthenticated_403(self):
        """
        Ensure an unauthenticated user can not decline a team invite.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer invalid-token")

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 401)

    def test_decline_invite_accepted_400(self):
        """
        Ensure user can not decline already accepted invite.
        """

        self.invite.accept()

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has been accepted.")

    def test_decline_invite_declined_400(self):
        """
        Ensure user can not decline already declined invite.
        """

        self.invite.decline()

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has been declined.")

    def test_decline_invite_expired_400(self):
        """
        Ensure user can not decline already expired invite.
        """

        self.invite.expire()

        url = reverse(
            "invite-decline",
        )

        resp = self.client.post(
            url,
            {"invite_id": self.invite.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data.get("message"), "This invite has expired.")

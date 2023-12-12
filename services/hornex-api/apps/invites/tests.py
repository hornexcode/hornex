import uuid
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from apps.teams.models import Team, Membership, Invite
from test.factories import TeamFactory, InviteFactory, UserFactory


class InvitesTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"/invites", include("invites.urls")),
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
        self.assertEqual(resp.data.get("error"), "Not found.")

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
        self.assertEqual(resp.data.get("error"), "This invite has been accepted.")

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
        self.assertEqual(resp.data.get("error"), "This invite has been declined.")

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
        self.assertEqual(resp.data.get("error"), "This invite has expired.")

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
        self.assertEqual(resp.data.get("error"), "Not found.")

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
        self.assertEqual(resp.data.get("error"), "This invite has been accepted.")

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
        self.assertEqual(resp.data.get("error"), "This invite has been declined.")

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
        self.assertEqual(resp.data.get("error"), "This invite has expired.")

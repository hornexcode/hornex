from asgiref.sync import sync_to_async
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.testing import WebsocketCommunicator
from django.test import TestCase
from django.urls import path
from rest_framework_simplejwt.tokens import RefreshToken

from apps.notifications.consumers import NotificationConsumer
from apps.notifications.models import Notification
from apps.teams.models import Team, TeamInvite
from apps.users.models import User
from core.middlewares.injectcookie import CookieMiddleware


class NotificationConsumerTest(TestCase):
    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)
        self.application = ProtocolTypeRouter(
            {
                "websocket": URLRouter(
                    [
                        path("notifications", NotificationConsumer.as_asgi()),
                    ]
                )
            }
        )

    async def test__connected_user_receives_team_invitation(self):
        communicator = WebsocketCommunicator(
            CookieMiddleware(self.application),
            "/notifications",
            [
                (
                    b"cookie",
                    b"hx.auth.token=" + bytes(str(self.refresh.access_token), "utf-8"),
                )
            ],
        )

        connected, subprotocol = await communicator.connect()
        assert connected

        team = await sync_to_async(Team.objects.create)(name="Test Team", created_by=self.user)
        await sync_to_async(TeamInvite.objects.create)(team=team, user=self.user)

        message = await communicator.receive_json_from(2)

        assert message.get("type", "") == Notification.ActivityType.TEAM_INVITATION
        assert message.get("data", {}).get("team", {}).get("id") == str(team.id)

        await communicator.disconnect()

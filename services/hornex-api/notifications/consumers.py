import json
from channels.generic.websocket import AsyncWebsocketConsumer
from notifications.models import Notification
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.exceptions import TokenError
from asgiref.sync import async_to_sync
import jwt


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        token = self.scope.get("cookies").get("hx", "")

        if not token:
            await self.send_error_message(f"Token is invalid")
            return await self.disconnect("1007")

        try:
            decoded_token = jwt.decode(
                str(token), config("SECRET_KEY"), algorithms=["HS256"]
            )
            print(decoded_token)
        except TokenError as e:
            await self.send_error_message(f"Token is invalid: {str(e)}")
            return await self.disconnect("1007")

        # user_id = decoded_token.payload
        # print("userid: ", user_id)

        async_to_sync(self.channel_layer.group_add)(token, self.channel_name)
        await self.send_notification()
        # await self.channel_layer_alias.add_group("notifications", self.channel_name)

    async def disconnect(self, code):
        # await self.channel_layer.group_discard("notifications", self.channel_name)
        return await super().disconnect(code)

    async def send_notification(self):
        await self.send(
            text_data=json.dumps(
                {"message": "should be event, but it does not exist", "type": "invite"}
            )
        )

    async def send_invitation_notification(self, invite):
        notification = Notification.objects.create(
            {"type": Notification.ActivityType.TEAM_INVITATION}
        )
        print(invite)

        await self.send(
            text_data=json.dumps(
                {
                    "message": "should be event, but it does not exist",
                    "type": notification.activity,
                    "notification": notification,
                }
            )
        )

    async def send_error_message(self, error_message):
        response_data = {"type": "error", "message": error_message}
        await self.send(json.dumps(response_data))

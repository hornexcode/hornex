import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("notifications", self.channel_name)

    async def disconnect(self, code):
        # await self.channel_layer.group_discard("notifications", self.channel_name)
        return await super().disconnect(code)

    async def send_notification(self):
        await self.send(
            text_data=json.dumps(
                {"message": "should be event, but it does not exist", "type": "invite"}
            )
        )

    async def send_invitation_notification(self, message):
        print(message)

        # await self.send(bytes_data=message)

    async def send_error_message(self, error_message):
        response_data = {"type": "error", "message": error_message}
        await self.send(json.dumps(response_data))

    async def team_invitation(self, message):
        """
        Since we have a notification `activity` of `team_invite` we need to implement this *handler* to be called when a channel_layer.group_send() is called with "group_name" and message={ type: "team_invite"} as arguments
        """

        await self.send(text_data=json.dumps(message))

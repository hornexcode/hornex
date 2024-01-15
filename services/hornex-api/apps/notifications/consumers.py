import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    user_channel_name = ""

    async def connect(self):
        await self.accept()

        # token = self.scope.get("cookies").get("hx.auth.token")
        print(self.scope.get("cookies"))
        # if not token:
        #     await self.send_error_message("No token provided")
        #     return await self.close()

        # decoded_token = jwt.decode(
        #     str(token), settings.SECRET_KEY, algorithms=["HS256"]
        # )

        # user_id = decoded_token.get("user_id")
        # self.user_channel_name = f"notifications_{user_id}"

        # await self.channel_layer.group_add(self.user_channel_name, self.channel_name)

    # async def disconnect(self, code):
    # await self.channel_layer.group_discard(
    #     self.user_channel_name, self.channel_name
    # )
    # return await super().disconnect(code)

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
        await self.send(text_data=json.dumps(message))

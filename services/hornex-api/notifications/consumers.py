from channels.generic.websocket import AsyncWebsocketConsumer

# from django.template import Template
import json


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.add_group("notifications", self.channel_name)

    async def disconnect(self, code):
        await self.channel_layer.group_discard("notifications", self.channel_name)
        # return await super().disconnect(code)

    async def send_notification(self, event):
        # template = Template('<a href="{{ link }}">{{ message }}</a>')
        # context = Context({"message": event["message"], "link": event["link"]})
        # template.render(context)

        # await self.send_json(event["message"])
        await self.send(
            text_data=json.dumps({"message": event["message"], "type": "invite"})
        )

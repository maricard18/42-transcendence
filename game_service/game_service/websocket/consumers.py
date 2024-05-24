import asyncio
import json
import secrets

from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.utils import asyncio

from .middleware import GameMiddleware


class GameConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.heartbeat_task = None
        self.room_group_name = None
        self.game_player_amount = None
        self.queue = None

    async def check_queue(self):
        players = {}
        if len(self.queue) % self.game_player_amount == 0:
            game_uid = secrets.token_urlsafe()
            selected_users = {}
            for index in range(self.game_player_amount):
                user_id = int(next(iter(self.queue)))
                selected_users[user_id] = self.queue[user_id]
                players[f"player_{index + 1}"] = user_id
                self.queue.pop(user_id, None)

            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "system.grouping",
                    "data": {
                        "game_uid": game_uid,
                        "players": players
                    }
                }
            )

            for user_id, channel_name in selected_users.items():
                await self.channel_layer.group_discard(
                    self.room_group_name, channel_name
                )
                await self.channel_layer.group_add(
                    f"game_{game_uid}", channel_name
                )

            for user_id, channel_name in selected_users.items():
                await self.channel_layer.group_send(
                    f"game_{game_uid}", {
                        "type": "system.message",
                        "data": {
                            "message": "user.connected",
                            "user_id": user_id
                        }
                    }
                )
        else:
            for index, user_id in enumerate(self.queue.keys()):
                players[f"player_{index + 1}"] = user_id
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "system.grouping",
                    "data": {
                        "players": players
                    }
                }
            )

    async def heartbeat(self):
        while True:
            await asyncio.sleep(2)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "system.monitoring",
                    "data": {
                        "message": "heartbeat"
                    }
                }
            )

    async def connect(self):
        user_id = self.scope["user"]
        game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_player_amount = int(self.scope["url_route"]["kwargs"]["player_amount"])
        self.room_group_name = f"game_{game_id}_queue_{self.game_player_amount}"

        self.queue = GameMiddleware.queue.setdefault(self.room_group_name, {})
        self.queue[user_id] = self.channel_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept("Authorization")
        await self.check_queue()

    async def disconnect(self, close_code):
        self.queue.pop(self.scope["user"], None)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "system.message",
                "data": {
                    "message": "user.disconnected",
                    "user_id": self.scope["user"]
                }
            }
        )

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except asyncio.CancelledError:
                pass

        raise StopConsumer()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if not self.heartbeat_task:
            loop = asyncio.get_running_loop()
            self.heartbeat_task = loop.create_task(self.heartbeat())

        if "queue" in self.room_group_name:
            return

        try:
            data = json.loads(text_data)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user.message",
                    "channel_name": self.channel_name,
                    "data": data
                }
            )
        except json.decoder.JSONDecodeError:
            pass

    async def user_message(self, event):
        if event["channel_name"] != self.channel_name:
            await self.send(text_data=json.dumps({
                "type": event["type"],
                "data": event["data"]
            }))

    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))

    async def system_grouping(self, event):
        if self.scope["user"] in event["data"]["players"].values():
            if "game_uid" in event["data"]:
                self.room_group_name = f"game_{event['data']['game_uid']}"
            await self.send(text_data=json.dumps({
                "type": event["type"],
                "data": {
                    "players": event["data"]["players"]
                }
            }))

    async def system_monitoring(self, event):
        await self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))

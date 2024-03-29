import json
import secrets

from asgiref.sync import async_to_sync
from channels.exceptions import StopConsumer
from channels.generic.websocket import JsonWebsocketConsumer

from .middleware import GameMiddleware


class GameConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.game_player_amount = None
        self.queue = None

    def check_queue(self):
        players = {}
        if len(self.queue) % self.game_player_amount == 0:
            game_uid = secrets.token_urlsafe()
            selected_users = {}
            for index in range(self.game_player_amount):
                user_id = int(next(iter(self.queue)))
                selected_users[user_id] = self.queue[user_id]
                players["player_%s" % (index + 1)] = user_id
                self.queue.pop(user_id, None)

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {
                    "type": "system.grouping",
                    "data": {
                        "game_uid": game_uid,
                        "players": players
                    }
                }
            )

            for user_id, channel_name in selected_users.items():
                async_to_sync(self.channel_layer.group_discard)(
                    self.room_group_name, channel_name
                )
                async_to_sync(self.channel_layer.group_add)(
                    "game_%s" % game_uid, channel_name
                )

            for user_id, channel_name in selected_users.items():
                async_to_sync(self.channel_layer.group_send)(
                    "game_%s" % game_uid, {
                        "type": "system.message",
                        "data": {
                            "message": "user.connected",
                            "user_id": user_id
                        }
                    }
                )
        else:
            for index, user_id in enumerate(self.queue.keys()):
                players["player_%s" % (index + 1)] = user_id
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {
                    "type": "system.grouping",
                    "data": {
                        "players": players
                    }
                }
            )

    def connect(self):
        user_id = self.scope["user"]
        game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_player_amount = int(self.scope["url_route"]["kwargs"]["player_amount"])
        self.room_group_name = "game_%s_queue_%s" % (game_id, self.game_player_amount)

        self.queue = GameMiddleware.queue.setdefault(self.room_group_name, {})
        self.queue[user_id] = self.channel_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept("Authorization")
        self.check_queue()

    def disconnect(self, close_code):
        self.queue.pop(self.scope["user"], None)

        async_to_sync(self.channel_layer.group_send)(
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
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

        raise StopConsumer()

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        # Send message to websocket
        if "queue" in self.room_group_name:
            return

        try:
            data = json.loads(text_data)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "user.message",
                    "channel_name": self.channel_name,
                    "data": json.dumps(data)
                }
            )
        except json.decoder.JSONDecodeError:
            pass

    def user_message(self, event):
        # if event["channel_name"] != self.channel_name:
        self.send(text_data=json.dumps({
            "type": event["type"],
            "data": json.dumps(event["data"])
        }))

    def system_message(self, event):
        self.send(text_data=json.dumps({
            "type": event["type"],
            "data": event["data"]
        }))

    def system_grouping(self, event):
        if self.scope["user"] in event["data"]["players"].values():
            if "game_uid" in event["data"]:
                self.room_group_name = "game_%s" % event["data"]["game_uid"]
            self.send(text_data=json.dumps({
                "type": event["type"],
                "data": {
                    "players": event["data"]["players"]
                }
            }))

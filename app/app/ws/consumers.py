import json
import secrets

from asgiref.sync import async_to_sync
from channels.exceptions import DenyConnection, StopConsumer
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .middleware import GameMiddleware


class GameConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.game_player_amount = None

    def check_queue(self):
        queue = GameMiddleware.user_ids[self.room_group_name]
        if len(queue) % self.game_player_amount == 0:
            game_uid = secrets.token_urlsafe()
            selected_users = {}
            players = {}
            for index in range(self.game_player_amount):
                user_id = int(next(iter(queue)))
                channel_name = GameMiddleware.get_user_uid(self.room_group_name, user_id)
                selected_users[str(user_id)] = channel_name
                players["player_%s" % (index + 1)] = int(user_id)
                GameMiddleware.remove_user(self.room_group_name, user_id)

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {
                    "channel_id": self.room_group_name,
                    "type": "system_grouping",
                    "game_uid": game_uid,
                    "players": players,
                }
            )

            for _, channel_name in selected_users.items():
                async_to_sync(self.channel_layer.group_discard)(
                    self.room_group_name, channel_name
                )
                async_to_sync(self.channel_layer.group_add)(
                    "game_%s" % game_uid, channel_name
                )

    def connect(self):
        user_id = self.scope["user"]
        game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.game_player_amount = int(self.scope["url_route"]["kwargs"]["player_amount"])
        self.room_group_name = "game_%s_queue_%s" % (game_id, self.game_player_amount)

        if not isinstance(user_id, AnonymousUser):
            GameMiddleware.add_user_uid(self.room_group_name, user_id, self.channel_name)

            # Join room group
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )

            self.accept()
            self.check_queue()
        else:
            raise DenyConnection()

    def disconnect(self, close_code):
        GameMiddleware.remove_user(self.room_group_name, self.scope['user'])

        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

        raise StopConsumer()

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        # self.send(text_data=json.dumps(text_data))
        # Send message to websocket
        if "queue" in self.room_group_name:
            return

        try:
            data = json.loads(text_data)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {"type": "user_message", "channel_name": self.channel_name, "data": json.dumps(data)}
            )
        except json.decoder.JSONDecodeError:
            pass

    def user_message(self, event):
        if event["channel_name"] != self.channel_name:
            data = json.loads(event["data"])
            self.send(text_data=json.dumps(data))

    def system_message(self, event):
        self.send(text_data=json.dumps(event))

    def system_grouping(self, event):
        if self.scope["user"] in event["players"].values():
            self.room_group_name = "game_%s" % event["game_uid"]
            self.send(text_data=json.dumps(event))

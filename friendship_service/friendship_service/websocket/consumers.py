import json
import os
from typing import Union

import requests
from asgiref.sync import async_to_sync
from channels.exceptions import StopConsumer
from channels.generic.websocket import JsonWebsocketConsumer

from friendship_service.websocket.middleware import FriendshipMiddleware


class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r


class FriendshipConsumer(JsonWebsocketConsumer):
    def get_friendship_list(self, auth: str) -> Union[list, None]:
        cert_path = os.environ.get("SSL_CERT_PATH") + os.environ.get("SSL_CERT_FILE")
        response = requests.get(
            "https://modsecurity-dev:8443/api/friendships",
            auth=BearerAuth(auth),
            verify=cert_path
        )
        if response.status_code == 200:
            return response.json()
        return None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = "friendships"
        self.friendships = []

    def connect(self):
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept("Authorization")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "system.message",
                "data": {
                    "message": "user.connected",
                    "user_id": self.scope["user"]
                }
            }
        )

        self.friendships = [friendship.get('friend_id') for friendship in self.get_friendship_list(self.scope["auth"])]
        for friend_id in self.friendships:
            if friend_id in FriendshipMiddleware.connected:
                self.send(text_data=json.dumps({
                    "type": "system.message",
                    "data": {
                        "message": "user.connected",
                        "user_id": friend_id
                    }
                }))

    def disconnect(self, close_code):
        user_id = self.scope["user"]
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "system.message",
                "data": {
                    "message": "user.disconnected",
                    "user_id": user_id
                }
            }
        )
        FriendshipMiddleware.connected.remove(user_id)

        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

        raise StopConsumer()

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            data = json.loads(text_data)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "user.message",
                    "channel_name": self.channel_name,
                    "data": data
                }
            )
        except json.decoder.JSONDecodeError:
            pass

    def user_message(self, event):
        if event["channel_name"] == self.channel_name:
            message = event["data"]["message"]
            friend_id = int(event["data"]["friend_id"])
            if message == "friendship.created":
                self.friendships.append(friend_id)
                if friend_id in FriendshipMiddleware.connected:
                    self.send(text_data=json.dumps({
                        "type": "system.message",
                        "data": {
                            "message": "user.connected",
                            "user_id": friend_id
                        }
                    }))
            elif message == "friendship.destroyed":
                if friend_id in self.friendships:
                    self.friendships.remove(friend_id)

    def system_message(self, event):
        if event["data"]["user_id"] in self.friendships:
            self.send(text_data=json.dumps({
                "type": event["type"],
                "data": event["data"]
            }))

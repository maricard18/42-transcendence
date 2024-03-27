from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken


class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b'sec-websocket-protocol' in headers:
            try:
                token_type, token_key = headers[b'sec-websocket-protocol'].split(b", ")
                if token_type == b'Authorization':
                    access_token = AccessToken(token_key)
                    scope['user'] = int(access_token.get('user_id'))
            except TokenError:
                scope['user'] = AnonymousUser()
            except ValueError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)


class GameMiddleware(BaseMiddleware):
    user_ids = {}

    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        user = scope["user"]
        if not isinstance(user, AnonymousUser):
            game_id = scope["url_route"]["kwargs"]["game_id"]
            game_player_amount = scope["url_route"]["kwargs"]["player_amount"]
            room_group_name = "game_%s_queue_%s" % (game_id, game_player_amount)
            if user not in self.user_ids:
                self.user_ids.setdefault(room_group_name, {})[user] = None
        return await super().__call__(scope, receive, send)

    @classmethod
    def add_user_uid(cls, room_group_name, user_id, user_uid) -> None:
        try:
            cls.user_ids[room_group_name][user_id] = user_uid
        except ValueError:
            pass

    @classmethod
    def get_user_uid(cls, room_group_name, user_id):
        try:
            return cls.user_ids.get(room_group_name, {}).get(user_id, None)
        except ValueError:
            return None

    @classmethod
    def remove_user(cls, room_group_name, user_id) -> None:
        try:
            queue = cls.user_ids.get(room_group_name, {})
            if user_id in queue:
                queue.pop(user_id, None)
        except ValueError:
            pass

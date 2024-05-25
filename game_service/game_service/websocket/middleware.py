from channels.middleware import BaseMiddleware
from channels.security.websocket import WebsocketDenier
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
        if isinstance(scope['user'], AnonymousUser):
            # Deny the connection
            denier = WebsocketDenier()
            return await denier(scope, receive, send)
        return await super().__call__(scope, receive, send)


class GameMiddleware(BaseMiddleware):
    queue = {}

    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        user = scope["user"]
        game_id = scope["url_route"]["kwargs"]["game_id"]
        game_player_amount = scope["url_route"]["kwargs"]["player_amount"]
        room_group_name = f"game_{game_id}_queue_{game_player_amount}"
        if user in self.queue.get(room_group_name, {}).keys():
            # Deny the connection
            denier = WebsocketDenier()
            return await denier(scope, receive, send)
        return await super().__call__(scope, receive, send)

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
                    scope['auth'] = str(access_token)
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


class FriendshipMiddleware(BaseMiddleware):
    connected = []

    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        user_id = scope["user"]
        if user_id in self.connected:
            # Deny the connection
            denier = WebsocketDenier()
            return await denier(scope, receive, send)
        FriendshipMiddleware.connected.append(user_id)
        return await super().__call__(scope, receive, send)

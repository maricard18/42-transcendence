"""
ASGI config for friendship_service project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import re_path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "friendship_service.settings")

django_asgi_app = get_asgi_application()

from .websocket.consumers import FriendshipConsumer
from .websocket.middleware import FriendshipMiddleware, JWTAuthMiddleware

application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    "http": django_asgi_app,

    # WebSocket handler
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddleware(
            URLRouter([
                re_path(r"^ws/friendships$",
                        FriendshipMiddleware(FriendshipConsumer.as_asgi()))
            ])
        )
    ),
})

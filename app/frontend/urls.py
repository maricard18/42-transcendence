from django.urls import re_path
from .views import RenderIndex

urlpatterns = [
	re_path(r'^/?$', RenderIndex),
	re_path(r'^sign-up/?$', RenderIndex),
	re_path(r'^create-profile/?$', RenderIndex),
	re_path(r'^login/?$', RenderIndex),
	re_path(r'^menu/?$', RenderIndex),
	re_path(r'^menu/pong-game/options/?$', RenderIndex),
	re_path(r'^menu/pong-game/single-player/?$', RenderIndex),
	re_path(r'^menu/pong-game/multiplayer/?$', RenderIndex),
	re_path(r'^menu/pong-game/multiplayer/waiting-room/2/?$', RenderIndex),
	re_path(r'^menu/pong-game/multiplayer/waiting-room/4/?$', RenderIndex),
	re_path(r'^menu/pong-game/single-player-tournament/?$', RenderIndex),
	re_path(r'^menu/pong-game/multiplayer-tournament/?$', RenderIndex),
	re_path(r'^menu/pong-game/play/?$', RenderIndex),
	re_path(r'^menu/pong-game/play/single-player/1/?$', RenderIndex),
	re_path(r'^menu/pong-game/play/single-player/2/?$', RenderIndex),
	re_path(r'^menu/profile/username/?$', RenderIndex),
	re_path(r'^menu/profile/password/?$', RenderIndex),
	re_path(r'^menu/profile/avatar/?$', RenderIndex),
]

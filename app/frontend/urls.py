from django.urls import re_path, path
from .views import RenderIndex, GetEnvVars

urlpatterns = [
	re_path(r'^/?$', RenderIndex),
	re_path(r'^sign-up/?$', RenderIndex),
	re_path(r'^create-profile/?$', RenderIndex),
	re_path(r'^create-profile/42/?$', RenderIndex),
	re_path(r'^login/?$', RenderIndex),
	re_path(r'^login/42/?$', RenderIndex),
	re_path(r'^home/?$', RenderIndex),
	re_path(r'^home/?$', RenderIndex),
	re_path(r'^home/pong-game/?$', RenderIndex),
	re_path(r'^home/pong-game/single-player/?$', RenderIndex),
	re_path(r'^home/pong-game/multiplayer/?$', RenderIndex),
	re_path(r'^home/pong-game/multiplayer/waiting-room/2/?$', RenderIndex),
	re_path(r'^home/pong-game/multiplayer/waiting-room/4/?$', RenderIndex),
	re_path(r'^home/pong-game/single-player/tournament/?$', RenderIndex),
	re_path(r'^home/pong-game/multiplayer/tournament/?$', RenderIndex),
	re_path(r'^home/pong-game/play/?$', RenderIndex),
	re_path(r'^home/pong-game/play/single-player/1/?$', RenderIndex),
	re_path(r'^home/pong-game/play/single-player/2/?$', RenderIndex),
	re_path(r'^home/pong-game/play/multiplayer/2/?$', RenderIndex),
	re_path(r'^home/pong-game/play/multiplayer/4/?$', RenderIndex),
	re_path(r'^home/profile/?$', RenderIndex),
	re_path(r'^home/profile/username/?$', RenderIndex),
	re_path(r'^home/profile/password/?$', RenderIndex),
	re_path(r'^home/profile/avatar/?$', RenderIndex),

	path('get-env-vars', GetEnvVars, name='get_env_vars'),
]

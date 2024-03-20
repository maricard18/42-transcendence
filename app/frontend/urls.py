from django.urls import path
from .views import RenderIndex

urlpatterns = [
	path('', RenderIndex),
	path('sign-up/', RenderIndex),
	path('login/', RenderIndex),
	path('menu/', RenderIndex),
	path('menu/pong-game/', RenderIndex),
	path('menu/profile/username/', RenderIndex),
	path('menu/profile/password/', RenderIndex),
	path('menu/profile/avatar/', RenderIndex),
]

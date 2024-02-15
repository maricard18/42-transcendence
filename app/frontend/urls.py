from django.urls import path
from .views import RenderIndex

urlpatterns = [
	path('', RenderIndex),
	path('sign-up/', RenderIndex),
	path('login/', RenderIndex)
]

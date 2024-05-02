from django.urls import path

from .routers import APIRouter
from .views import UserViewSet, OTPViewSet, TokenViewSet, SSOViewSet


##########
## API  ##
##########

class API:
    router = APIRouter()

    router.register(r'users', UserViewSet, basename='user')

    urlpatterns = [
        path('users/<int:pk>/otp', OTPViewSet.as_view({'get': 'retrieve', 'post': 'create', 'delete': 'destroy'}),
             name='user_otp'),
    ]
    urlpatterns += router.urls


##########
## AUTH ##
##########

class Auth:
    router = APIRouter()

    router.register(r'token', TokenViewSet, basename='token')
    router.register(r'sso', SSOViewSet, basename='sso')

    urlpatterns = router.urls

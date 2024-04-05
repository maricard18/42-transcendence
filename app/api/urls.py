from .routers import APIRouter
from .views import UserViewSet, TokenViewSet, SSOViewSet

router = APIRouter()

router.register(r'tokens', TokenViewSet, basename='token')
router.register(r'users', UserViewSet, basename='user')
router.register(r'sso', SSOViewSet, basename='sso')

urlpatterns = router.urls

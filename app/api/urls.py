from .routers import APIRouter
from .views import UserViewSet, TokenViewSet, SSOViewSet, OTPViewSet

router = APIRouter()

router.register(r'tokens', TokenViewSet, basename='token')
router.register(r'users', UserViewSet, basename='user')
router.register(r'sso', SSOViewSet, basename='sso')
router.register(r'otp', OTPViewSet, basename='otp')

urlpatterns = router.urls

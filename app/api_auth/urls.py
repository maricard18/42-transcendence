from .routers import APIAuthRouter
from .views import TokenViewSet, SSOViewSet

router = APIAuthRouter()

router.register(r'token', TokenViewSet, basename='token')
router.register(r'sso', SSOViewSet, basename='sso')

urlpatterns = router.urls

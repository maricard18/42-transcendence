from .routers import APIRouter
from .views import UserViewSet, TokenViewSet

router = APIRouter()

router.register(r'tokens', TokenViewSet, basename='token')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = router.urls

from .routers import APIRouter
from .views import FriendshipViewSet

##########
## API  ##
##########

api_router = APIRouter()

api_router.register(r"friendships", FriendshipViewSet, basename="friendship")

urlpatterns = api_router.urls

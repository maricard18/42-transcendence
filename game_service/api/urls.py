from .routers import APIRouter
from .views import GameViewSet

##########
## API  ##
##########

api_router = APIRouter()

api_router.register(r"games", GameViewSet, basename="game")

urlpatterns = api_router.urls

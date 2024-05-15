from rest_framework import viewsets, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from common.Vault import Vault
from common.exceptions import ServerError
from common.utils import generate_host
from .models import Friendship
from .permissions import FriendshipPermission
from .serializers import FriendshipSerializer, CreateFriendshipSerializer


##########################
#### /api/friendships ####
##########################

class FriendshipViewSet(viewsets.ViewSet):
    permission_classes = [FriendshipPermission]

    def list(self, request):
        friend_id_filter = request.GET.get("filter[friend_id]", None)
        if friend_id_filter:
            queryset = Friendship.objects.filter(user_id=request.user.id, friend_id=friend_id_filter)
        else:
            queryset = Friendship.objects.filter(user_id=request.user.id)

        serializer = FriendshipSerializer(queryset, many=True)
        return Response(Vault.cipherSensitiveFields(
            serializer.data,
            request,
            Vault.transitEncrypt
        ), status=status.HTTP_200_OK)

    def create(self, request):
        serializer = CreateFriendshipSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            friendship = Friendship.objects.create(
                user_id=serializer.validated_data.get('user_id'),
                friend_id=serializer.validated_data.get('friend_id')
            )
            return Response(Vault.cipherSensitiveFields(
                {
                    "id": friendship.id,
                    "url": generate_host(request) + request.path + "/" + str(friendship.id)
                },
                request,
                Vault.transitEncrypt
            ), status=status.HTTP_201_CREATED)
        raise ServerError

    def retrieve(self, request, pk=None):
        self.check_object_permissions(request, pk)
        try:
            friendship = Friendship.objects.get(pk=pk)
        except Friendship.DoesNotExist:
            raise NotFound

        serializer = FriendshipSerializer(friendship)
        return Response(Vault.cipherSensitiveFields(
            serializer.data,
            request,
            Vault.transitEncrypt
        ), status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        self.check_object_permissions(request, pk)
        try:
            friendship = Friendship.objects.get(pk=pk)
        except Friendship.DoesNotExist:
            raise NotFound

        friendship.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

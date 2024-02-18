from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from .permissions import UserPermission, TokenPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, AuthUserSerializer


# Create your views here.

######################
####  /api/users  ####
######################

class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermission]

    # GET /api/users
    def list(self, request):
        return Response(UserSerializer(self.queryset, many=True).data)

    # POST /api/users/
    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(serializer.validated_data.get('username'),
                                            serializer.validated_data.get('email'),
                                            serializer.validated_data.get('password'))

            token = Token.objects.create(user=user)
            return Response({'data': UserSerializer(user).data, 'token': token.key}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET /api/users/:id
    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'errors': {'message': 'User Not Found', 'code': 404}}, status=status.HTTP_404_NOT_FOUND)

        return Response(UserSerializer(user).data)

    # PUT /api/users/:id/
    def update(self, request, pk=None):
        if request.user.pk == int(pk):
            serializer = UpdateUserSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                for key, value in serializer.data.items():
                    if key == "password":
                        request.user.set_password(value)
                        continue
                    if hasattr(request.user, key):
                        setattr(request.user, key, value)
                request.user.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)

    # DELETE /api/users/:id/
    def destroy(self, request, pk=None):
        if request.user.pk == int(pk):
            request.user.delete()
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)


#######################
##### /api/tokens #####
#######################

class TokenViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer_class = AuthUserSerializer
    permission_classes = [TokenPermission]

    # POST /api/tokens/
    def create(self, request):
        serializer = AuthUserSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            try:
                if username:
                    user = User.objects.get(username=username)
                elif email:
                    user = User.objects.get(email=email)
                else:
                    return Response({'errors': {'message': 'Bad Request', 'code': 400}},
                                    status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'errors': {'message': 'User Not Found', 'code': 404}},
                                status=status.HTTP_404_NOT_FOUND)
            user = authenticate(username=AuthUserSerializer(user).data.get('username'),
                                password=serializer.validated_data.get('password'))
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_201_CREATED)
            return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /api/tokens/
    def destroy_token(self, request, pk=None):
        request.user.auth_token.delete()
        return Response({}, status=status.HTTP_204_NO_CONTENT)

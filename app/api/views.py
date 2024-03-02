from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .permissions import UserPermission, TokenPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, AuthUserSerializer, \
    APITokenObtainPairSerializer, TokenSerializer, DestroyTokenSerializer


######################
####  /api/users  ####
######################

class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [UserPermission]
    lookup_field = 'username'

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

            return Response(
                {'id': user.id, 'login': user.username, 'url': request.build_absolute_uri() + user.username},
                status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET /api/users/:username
    def retrieve(self, request, username=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'errors': {'message': 'User Not Found', 'code': 404}}, status=status.HTTP_404_NOT_FOUND)

        return Response(UserSerializer(user).data)

    # PUT /api/users/:username/
    def update(self, request, username=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'errors': {'message': 'User Not Found', 'code': 404}}, status=status.HTTP_404_NOT_FOUND)
        if int(request.auth.get('user_id')) == user.id:
            serializer = UpdateUserSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                for key, value in serializer.data.items():
                    if key == "password":
                        user.set_password(value)
                        continue
                    if hasattr(user, key):
                        setattr(user, key, value)
                user.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)

    # DELETE /api/users/:username/
    def destroy(self, request, username=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'errors': {'message': 'User Not Found', 'code': 404}}, status=status.HTTP_404_NOT_FOUND)
        if int(request.auth.get('user_id')) == user.id:
            user.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)


#######################
##### /api/tokens #####
#######################

class TokenViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [TokenPermission]

    def new_token(self, request):
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
                    return Response({'errors': {'message': "Field 'username' or 'email' is required", 'code': 400}},
                                    status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'errors': {'message': 'User Not Found', 'code': 404}},
                                status=status.HTTP_404_NOT_FOUND)
            user = authenticate(username=AuthUserSerializer(user).data.get('username'),
                                password=serializer.validated_data.get('password'))
            if user is not None:
                refresh_token = APITokenObtainPairSerializer.get_token(user)

                return Response({
                    'access_token': str(refresh_token.access_token),
                    'token_type': "Bearer",
                    'expires_in': refresh_token.access_token.lifetime.seconds,
                    'scope': refresh_token.payload.get('scope'),
                    'refresh_token': str(refresh_token)
                }, status=status.HTTP_200_OK)
            return Response({'errors': {'message': 'Unauthorized', 'code': 401}}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def refresh_token(self, request):
        try:
            refresh_token = RefreshToken(request.data.get('refresh_token'))
        except TokenError as e:
            return_status = status.HTTP_400_BAD_REQUEST
            if e.args[0] == 'Token is blacklisted':
                return_status = status.HTTP_401_UNAUTHORIZED
            return Response({'errors': {'message': e.args[0], 'code': return_status}}, status=return_status)
        except Exception as e:
            return Response({'errors': {'message': e.args[0], 'code': 500}},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'access_token': str(refresh_token.access_token),
            'token_type': "Bearer",
            'expires_in': refresh_token.access_token.lifetime.seconds,
            'scope': refresh_token.payload.get('scope'),
            'refresh_token': str(refresh_token)
        }, status=status.HTTP_200_OK)

    # POST /api/tokens/
    def create(self, request):
        serializer = TokenSerializer(data=request.data)
        if serializer.is_valid():
            if request.data.get('grant_type') == 'password':
                return self.new_token(request)
            elif request.data.get('grant_type') == 'refresh_token':
                return self.refresh_token(request)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /api/tokens/
    def destroy_token(self, request):
        serializer = DestroyTokenSerializer(data=request.data)
        if serializer.is_valid():
            try:
                RefreshToken(serializer.validated_data.get('refresh_token')).blacklist()
            except TokenError as e:
                return_status = status.HTTP_400_BAD_REQUEST
                if e.args[0] == 'Token is blacklisted':
                    return_status = status.HTTP_401_UNAUTHORIZED
                return Response({'errors': {'message': e.args[0], 'code': return_status}}, status=return_status)
            except Exception as e:
                return Response({'errors': {'message': e.args[0], 'code': 500}},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

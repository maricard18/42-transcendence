import os
import secrets

import pyotp
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import Avatar, SSO_User, OTP_Token
from .permissions import UserPermission, TokenPermission, SSOPermission, OTPPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, AuthUserSerializer, \
    APITokenObtainPairSerializer, TokenSerializer


######################
####  /api/users  ####
######################

class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [UserPermission]

    # GET /api/users
    def list(self, request):
        return Response(UserSerializer(self.queryset, many=True, context={'request': request}).data)

    # POST /api/users
    def create(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(serializer.validated_data.get('username'),
                                            serializer.validated_data.get('email'),
                                            serializer.validated_data.get('password'))
            avatar = serializer.validated_data.get('avatar')
            if avatar:
                Avatar.objects.create(
                    user=user,
                    avatar=avatar,
                    request=request
                )
            return Response({
                'id': user.id,
                'login': user.username,
                'url': request.build_absolute_uri() + '/' + user.username
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET /api/users/:id
    # GET /api/users/:username
    def retrieve(self, request, pk=None):
        user = get_user(pk)
        if not user:
            return Response({
                'errors': {
                    'message': 'User Not Found',
                    'code': 404
                }
            }, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user, context={'request': request}).data)

    # PUT /api/users/:id
    # PUT /api/users/:username
    def update(self, request, pk=None):
        user = get_user(pk)
        if not user:
            return Response({
                'errors': {
                    'message': 'User Not Found',
                    'code': 404
                }
            }, status=status.HTTP_404_NOT_FOUND)

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

                avatar = serializer.validated_data.get('avatar')
                if avatar:
                    Avatar.objects.update_or_create(
                        user=user,
                        avatar=avatar,
                        request=request
                    )
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            return Response({
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'errors': {
                'message': 'Unauthorized',
                'code': 401
            }
        }, status=status.HTTP_401_UNAUTHORIZED)

    # DELETE /api/users/:id
    # DELETE /api/users/:username
    def destroy(self, request, pk=None):
        user = get_user(pk)
        if not user:
            return Response({
                'errors': {
                    'message': 'User Not Found',
                    'code': 404
                }
            }, status=status.HTTP_404_NOT_FOUND)

        if int(request.auth.get('user_id')) == user.id:
            user.is_active = False
            user.save()
            user.set_password(None)
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        return Response({
            'errors': {
                'message': 'Unauthorized',
                'code': 401
            }
        }, status=status.HTTP_401_UNAUTHORIZED)


#######################
##### /api/tokens #####
#######################

class TokenViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [TokenPermission]

    @staticmethod
    def new_token(request):
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
                    return Response({
                        'errors': {
                            'message': "Field 'username' or 'email' is required",
                            'code': 400
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({
                    'errors': {
                        'message': 'User Not Found',
                        'code': 404
                    }
                }, status=status.HTTP_404_NOT_FOUND)
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
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': 401
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def refresh_token(request):
        try:
            refresh_token = RefreshToken(request.data.get('refresh_token'))
        except TokenError as e:
            return Response({
                'errors': {
                    'message': e.args[0],
                    'code': status.HTTP_400_BAD_REQUEST
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'access_token': str(refresh_token.access_token),
            'token_type': "Bearer",
            'expires_in': refresh_token.access_token.lifetime.seconds,
            'scope': refresh_token.payload.get('scope'),
            'refresh_token': str(refresh_token)
        }, status=status.HTTP_200_OK)

    # POST /api/tokens
    def create(self, request):
        serializer = TokenSerializer(data=request.data)
        if serializer.is_valid():
            if request.data.get('grant_type') == 'password':
                return self.new_token(request)
            elif request.data.get('grant_type') == 'refresh_token':
                return self.refresh_token(request)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


#######################
#####  /api/sso   #####
#######################

class SSOViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [SSOPermission]

    @classmethod
    def sso_101010(cls, request):
        code = request.GET.get('code', '')
        if code != '':
            import requests

            response = requests.post('https://api.intra.42.fr/oauth/token', data={
                'grant_type': 'authorization_code',
                'client_id': os.environ.get('42_CLIENT_ID'),
                'client_secret': os.environ.get('42_CLIENT_SECRET'),
                'code': code,
                'redirect_uri': os.environ.get('42_REDIRECT_URI')
            })
            if response.status_code == 200:
                user_info = requests.get('https://api.intra.42.fr/v2/me',
                                         headers={'Authorization': 'Bearer ' + response.json()['access_token']}).json()

                try:
                    user, created, conflict = SSO_User.objects.get_or_create(
                        sso='101010',
                        sso_id=user_info.get('id'),
                        username=user_info.get('login'),
                        email=user_info.get('email'),
                        image_link=user_info.get('image').get('link')
                    )
                except Exception as e:
                    return Response({
                        'errors': {
                            'message': "An error occurred while creating an user.\n" + str(e),
                            'code': status.HTTP_500_INTERNAL_SERVER_ERROR
                        }
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                refresh_token = APITokenObtainPairSerializer.get_token(user)

                return Response({
                    'access_token': str(refresh_token.access_token),
                    'token_type': "Bearer",
                    'expires_in': refresh_token.access_token.lifetime.seconds,
                    'scope': refresh_token.payload.get('scope'),
                    'refresh_token': str(refresh_token)
                }, status=status.HTTP_200_OK if conflict is False else status.HTTP_409_CONFLICT)
            return Response(response.json(), status=response.status_code)
        return Response({
            'errors': {
                'message': "Query parameter 'code' is required.",
                'code': status.HTTP_400_BAD_REQUEST
            }
        }, status=status.HTTP_400_BAD_REQUEST)

    def callback(self, request, pk=None):
        if str(pk) == '101010':
            return self.sso_101010(request)
        else:
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': 401
                }
            }, status=status.HTTP_401_UNAUTHORIZED)


#######################
#####  /api/otp   #####
#######################

class OTPViewSet(viewsets.ViewSet):
    permission_classes = [OTPPermission]

    # POST /api/otp
    def create(self, request):
        user = User.objects.get(pk=request.user.id)
        try:
            OTP_Token.objects.get(user=user)
            return Response({
                'errors': {
                    'message': "User already has an active OTP.",
                    'code': status.HTTP_409_CONFLICT
                }
            }, status=status.HTTP_409_CONFLICT)
        except OTP_Token.DoesNotExist:
            otp = OTP_Token.objects.create(
                auth_user=user,
                token=pyotp.random_base32()
            )

        url = pyotp.totp.TOTP(otp.token).provisioning_uri(name=otp.auth_user.username, issuer_name='ft_transcendence')
        return Response({
            'url': url
        }, status=status.HTTP_200_OK)

    # GET /api/otp/:id
    def retrieve(self, request, pk=None):
        if int(request.user.id) != int(pk):
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        if request.GET.get('code') is None:
            return Response({
                'errors': {
                    'message': "Query parameter 'code' is required.",
                    'code': status.HTTP_400_BAD_REQUEST
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(pk=int(request.user.id))
            totp = pyotp.TOTP(OTP_Token.objects.get(auth_user=user).token)
        except OTP_Token.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'valid': totp.now() == int(request.GET.get('code'))
        }, status=status.HTTP_200_OK)

    # DELETE /api/otp/:id
    def destroy(self, request, pk=None):
        if int(request.user.id) != int(pk):
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user = User.objects.get(pk=int(request.user.id))
            otp = OTP_Token.objects.get(auth_user=user)
            otp.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except OTP_Token.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)

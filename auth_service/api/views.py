import os
import secrets

import pyotp
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from common.Vault import Vault
from common.utils import get_secret_from_file
from .models import OTP_Token, Avatar, SSO_User
from .permissions import UserPermission, OTPPermission, TokenPermission, SSOPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, CreateOTPSerializer, \
    AuthUserSerializer, APITokenObtainPairSerializer, TokenSerializer


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
        data = Vault.resolveEncryptedFields(request.data)
        serializer = CreateUserSerializer(data=data)
        if serializer.is_valid():
            user = User.objects.create_user(serializer.validated_data.get('username'),
                                            serializer.validated_data.get('email'),
                                            serializer.validated_data.get('password'))
            avatar = serializer.validated_data.get('avatar')
            if avatar:
                Avatar.objects.create(
                    auth_user=user,
                    avatar=avatar,
                    request=request
                )
            return Response({
                'id': user.id,
                'login': user.username,
                'url': request.build_absolute_uri() + '/' + str(user.id)
            }, status=status.HTTP_201_CREATED)
        username_errors = serializer.errors.get('username', None)
        if any(error == "A user with that username already exists." for error in username_errors):
            return Response({
                'errors': {
                    'message': "A user with that username already exists.",
                    'code': status.HTTP_409_CONFLICT
                }
            }, status=status.HTTP_409_CONFLICT)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # GET /api/users/:id
    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user, context={'request': request}).data)

    # PUT /api/users/:id
    def update(self, request, pk=None):
        if int(request.user.id) != int(pk):
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)

        data = Vault.resolveEncryptedFields(request.data)
        serializer = UpdateUserSerializer(data=data, partial=True)
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
                    auth_user=user,
                    avatar=avatar,
                    request=request
                )
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        username_errors = serializer.errors.get('username', None)
        if any(error == "A user with that username already exists." for error in username_errors):
            return Response({
                'errors': {
                    'message': "A user with that username already exists.",
                    'code': status.HTTP_409_CONFLICT
                }
            }, status=status.HTTP_409_CONFLICT)
        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /api/users/:id
    def destroy(self, request, pk=None):
        if int(request.user.id) != int(pk):
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)

        # Delete Avatar
        try:
            Avatar.objects.get(auth_user=user).delete()
        except Avatar.DoesNotExist:
            pass

        # Delete SSO User
        try:
            SSO_User.objects.get(auth_user=user).delete()
        except SSO_User.DoesNotExist:
            pass

        # GDPR Anonymize User
        user.username = secrets.token_hex()
        user.email = None
        user.password = None
        user.is_active = False
        user.save()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


##############################
##### /api/users/:id/otp #####
##############################

class OTPViewSet(viewsets.ViewSet):
    permission_classes = [OTPPermission]

    # POST /api/users/:id/otp
    def create(self, request, pk=None):
        if int(request.user.id) != int(pk):
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
        user = User.objects.get(pk=request.user.id)
        serializer = CreateOTPSerializer(data={'auth_user': user})
        if serializer.is_valid():
            otp = OTP_Token.objects.create(
                auth_user=user,
                token=pyotp.random_base32()
            )
            url = pyotp.totp.TOTP(otp.token).provisioning_uri(name=otp.auth_user.username,
                                                              issuer_name='ft_transcendence')
            return Response({
                'url': url
            }, status=status.HTTP_201_CREATED)
        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # GET /api/users/:id/otp
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
                    'message': "Query parameter 'code' is required",
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

    # DELETE /api/users/:id/otp
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
            OTP_Token.objects.get(auth_user=user).delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except OTP_Token.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)


#######################
##### /auth/token #####
#######################

class TokenViewSet(viewsets.ViewSet):
    permission_classes = [TokenPermission]

    @staticmethod
    def new_token(request):
        data = Vault.resolveEncryptedFields(request.data)
        serializer = AuthUserSerializer(data=data, partial=True)
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
                            'code': status.HTTP_400_BAD_REQUEST
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({
                    'errors': {
                        'message': 'Resource Not Found',
                        'code': status.HTTP_404_NOT_FOUND
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
                    'refresh_token': str(refresh_token)
                }, status=status.HTTP_200_OK)
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
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
            'refresh_token': str(refresh_token)
        }, status=status.HTTP_200_OK)

    # POST /auth/token
    def create(self, request):
        data = Vault.resolveEncryptedFields(request.data)
        serializer = TokenSerializer(data=data)
        if serializer.is_valid():
            if request.data.get('grant_type') == 'password':
                return self.new_token(request)
            elif request.data.get('grant_type') == 'refresh_token':
                return self.refresh_token(request)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


#######################
#####  /auth/sso  #####
#######################

class SSOViewSet(viewsets.ViewSet):
    permission_classes = [SSOPermission]

    @classmethod
    def check_params(cls, **kwargs):
        action = kwargs.get("action")
        user_id = kwargs.get("user_id")
        code = kwargs.get("code")

        if not action or not code:
            raise serializers.ValidationError({
                'errors': {
                    'message': "'action' and 'code' query parameters are required",
                    'code': status.HTTP_400_BAD_REQUEST
                }
            })

        if action not in ['link', 'register']:
            raise serializers.ValidationError({
                'errors': {
                    'message': "'action' query parameter must be 'link' or 'register'",
                    'code': status.HTTP_400_BAD_REQUEST
                }
            })

        if action == 'link' and not user_id:
            raise serializers.ValidationError({
                'errors': {
                    'message': "'user_id' query parameter is required when linking",
                    'code': status.HTTP_400_BAD_REQUEST
                }
            })

    @classmethod
    def sso_101010(cls, request):
        conflict = False
        auth_user = None
        action = request.GET.get('action', None)
        user_id = request.GET.get('user_id', None)
        code = request.GET.get('code', None)

        try:
            cls.check_params(action=action, user_id=user_id, code=code)
            if action == 'link':
                auth_user = User.objects.get(pk=user_id)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({
                'errors': {
                    'message': 'Resource Not Found',
                    'code': status.HTTP_404_NOT_FOUND
                }
            }, status=status.HTTP_404_NOT_FOUND)

        import requests

        response = requests.post('https://api.intra.42.fr/oauth/token', data={
            'grant_type': 'authorization_code',
            'client_id': os.environ.get('SSO_42_CLIENT_ID'),
            'client_secret': get_secret_from_file(os.environ.get('SSO_42_CLIENT_SECRET_FILE')),
            'code': code,
            'redirect_uri': os.environ.get('SSO_42_REDIRECT_URI')
        })
        if response.status_code == 200:
            user_info = requests.get('https://api.intra.42.fr/v2/me',
                                     headers={'Authorization': 'Bearer ' + response.json()['access_token']}).json()
            try:
                user = SSO_User.objects.get(
                    sso_provider='101010',
                    sso_id=user_info.get('id')
                )
                auth_user = user.auth_user
            except SSO_User.DoesNotExist:
                if action == 'register':
                    username = user_info.get('login')
                    while True:
                        try:
                            User.objects.get(username=username)
                            username = secrets.token_hex(4)
                            conflict = True
                        except User.DoesNotExist:
                            break

                    auth_user = User.objects.create_user(
                        username=username,
                        email=user_info.get('email')
                    )

                SSO_User.objects.create(
                    sso_provider='101010',
                    username=user_info.get('login'),
                    email=user_info.get('email'),
                    sso_id=user_info.get('id'),
                    auth_user=auth_user
                )

                if user_info.get('image').get('link'):
                    Avatar.objects.create(auth_user=auth_user, link=user_info.get('image').get('link'))

            if action == 'link':
                return Response({}, status=status.HTTP_201_CREATED)
            else:
                refresh_token = APITokenObtainPairSerializer.get_token(auth_user)

                return Response({
                    'access_token': str(refresh_token.access_token),
                    'token_type': "Bearer",
                    'expires_in': refresh_token.access_token.lifetime.seconds,
                    'refresh_token': str(refresh_token)
                }, status=status.HTTP_200_OK if conflict is False else status.HTTP_409_CONFLICT)
        return Response(response.json(), status=response.status_code)

    def callback(self, request, pk=None):
        if str(pk) == '101010':
            return self.sso_101010(request)
        else:
            return Response({
                'errors': {
                    'message': 'Unauthorized',
                    'code': status.HTTP_401_UNAUTHORIZED
                }
            }, status=status.HTTP_401_UNAUTHORIZED)

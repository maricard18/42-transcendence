import os
import secrets
from typing import Dict, Union, List

import pyotp
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound, ParseError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from common.Vault import Vault
from common.utils import get_secret_from_file
from .exceptions import ServerError
from .models import OTP_Token, Avatar, SSO_User
from .permissions import UserPermission, OTPPermission, TokenPermission, SSOPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, CreateOTPSerializer, \
    AuthUserSerializer, APITokenObtainPairSerializer, TokenSerializer, SSOSerializer


######################
####  /api/users  ####
######################

def remove_sensitive_information(user_pk: int, data: Union[Dict, List[Dict]], many: bool = False):
    def hide_email(user_data: Dict) -> None:
        if 'id' in user_data and int(user_data['id']) != user_pk:
            user_data['email'] = '[hidden]'

    if many:
        for user in data:
            hide_email(user)
    else:
        hide_email(data)

    return data


def generate_host(request: HttpRequest) -> str:
    scheme = request.headers.get('X-Forwarded-Proto')
    host = request.headers.get('Host')
    port = ""
    if request.headers.get('X-Forwarded-Port') not in ["80", "443"]:
        port = ":" + request.headers.get('X-Forwarded-Port')
    return scheme + "://" + host + port


class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    permission_classes = [UserPermission]

    # GET /api/users
    def list(self, request):
        serializer = UserSerializer(self.queryset, many=True)
        return Response(remove_sensitive_information(request.user.id, serializer.data, many=True))

    # POST /api/users
    def create(self, request):
        data = Vault.resolveEncryptedFields(request.data, request)
        serializer = CreateUserSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = User.objects.create_user(
                serializer.validated_data.get('username'),
                serializer.validated_data.get('email'),
                serializer.validated_data.get('password')
            )

            avatar = serializer.validated_data.get('avatar')
            if avatar:
                Avatar.objects.create(
                    auth_user=user,
                    avatar=avatar,
                    request=request
                )

            url = generate_host(request) + request.path + '/' + str(user.id)
            return Response({
                'id': Vault.transitEncrypt(str(user.id)),
                'login': Vault.transitEncrypt(user.username),
                'url': Vault.transitEncrypt(url)
            }, status=status.HTTP_201_CREATED)

        raise ServerError

    # GET /api/users/:id
    def retrieve(self, request, pk=None):
        try:
            user = self.queryset.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound
        serializer = UserSerializer(user)

        return Response(remove_sensitive_information(request.user.id, serializer.data))

    # PUT /api/users/:id
    def update(self, request, pk=None):
        self.check_object_permissions(request, pk)
        user = self.queryset.get(pk=pk)

        data = Vault.resolveEncryptedFields(request.data, request)
        if data.get('avatar', None) == '':
            Avatar.objects.filter(auth_user=user).delete()
            data.pop('avatar')

        serializer = UpdateUserSerializer(data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            for key, value in serializer.validated_data.items():
                if key == "password":
                    user.set_password(value)
                    continue
                if hasattr(user, key):
                    setattr(user, key, value)
            user.save()

            avatar = serializer.validated_data.get('avatar', None)
            if avatar:
                Avatar.objects.update_or_create(
                    auth_user=user,
                    avatar=avatar,
                    request=request
                )
            return Response(None, status=status.HTTP_204_NO_CONTENT)

        raise ServerError

    # DELETE /api/users/:id
    def destroy(self, request, pk=None):
        self.check_object_permissions(request, pk)
        user = self.queryset.get(pk=pk)

        # Delete Avatar
        Avatar.objects.filter(auth_user=user).delete()

        # Delete SSO User
        SSO_User.objects.filter(auth_user=user).delete()

        # GDPR Anonymize User
        user.username = secrets.token_hex()
        user.email = ''
        user.is_active = False
        user.save()
        user.set_unusable_password()
        return Response(None, status=status.HTTP_204_NO_CONTENT)


##############################
##### /api/users/:id/otp #####
##############################

class OTPViewSet(viewsets.ViewSet):
    queryset = OTP_Token.objects.all()
    permission_classes = [OTPPermission]

    # POST /api/users/:id/otp
    def create(self, request, pk=None):
        self.check_object_permissions(request, pk)
        user = User.objects.get(pk=pk)

        serializer = CreateOTPSerializer(data={
            'auth_user': user.id
        })
        if serializer.is_valid(raise_exception=True):
            otp = self.queryset.create(
                auth_user=user,
                token=pyotp.random_base32()
            )

            url = pyotp.totp.TOTP(otp.token).provisioning_uri(
                name=otp.auth_user.username,
                issuer_name='ft_transcendence'
            )

            return Response({
                'url': url
            }, status=status.HTTP_201_CREATED)

        raise ServerError

    # GET /api/users/:id/otp
    def retrieve(self, request, pk=None):
        self.check_object_permissions(request, pk)
        user = User.objects.get(pk=pk)

        try:
            otp = self.queryset.get(auth_user=user)
            if request.GET.get('code') is None:
                return Response({
                    'active': otp.active,
                    'created_at': otp.created_at
                }, status=status.HTTP_200_OK)

            totp = pyotp.TOTP(otp.token)
        except OTP_Token.DoesNotExist:
            raise NotFound

        valid = totp.now() == int(request.GET.get('code'))
        if valid and request.GET.get('activate'):
            otp.active = True
            otp.save()

        return Response({
            'valid': valid
        }, status=status.HTTP_200_OK)

    # DELETE /api/users/:id/otp
    def destroy(self, request, pk=None):
        self.check_object_permissions(request, pk)
        user = User.objects.get(pk=pk)

        try:
            self.queryset.get(auth_user=user).delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except OTP_Token.DoesNotExist:
            raise NotFound


#######################
##### /auth/token #####
#######################

class TokenViewSet(viewsets.ViewSet):
    permission_classes = [TokenPermission]

    @staticmethod
    def new_token(request: HttpRequest) -> Response:
        data = Vault.resolveEncryptedFields(request.data, request)
        serializer = AuthUserSerializer(data=data, partial=True)
        if serializer.is_valid(raise_exception=False):
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            try:
                if username:
                    user = User.objects.get(username=username)
                elif email:
                    user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise NotFound

            user = authenticate(
                username=AuthUserSerializer(user).data.get('username'),
                password=serializer.validated_data.get('password')
            )
            if user is not None:
                refresh_token = APITokenObtainPairSerializer.get_token(user)

                return Response({
                    'access_token': str(refresh_token.access_token),
                    'token_type': "Bearer",
                    'expires_in': refresh_token.access_token.lifetime.seconds,
                    'refresh_token': str(refresh_token)
                }, status=status.HTTP_200_OK)
            raise AuthenticationFailed

        raise ServerError

    @staticmethod
    def refresh_token(request: HttpRequest) -> Response:
        try:
            refresh_token = RefreshToken(request.data.get('refresh_token'))
        except TokenError as exc:
            raise ParseError(exc.args[0])

        return Response({
            'access_token': str(refresh_token.access_token),
            'token_type': "Bearer",
            'expires_in': refresh_token.access_token.lifetime.seconds,
            'refresh_token': str(refresh_token)
        }, status=status.HTTP_200_OK)

    # POST /auth/token
    def create(self, request):
        data = Vault.resolveEncryptedFields(request.data, request)
        serializer = TokenSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            if request.data.get('grant_type') == 'password':
                return self.new_token(request)
            elif request.data.get('grant_type') == 'refresh_token':
                return self.refresh_token(request)

        raise ServerError


#######################
#####  /auth/sso  #####
#######################

class SSOViewSet(viewsets.ViewSet):
    permission_classes = [SSOPermission]

    @staticmethod
    def sso_101010(request: HttpRequest) -> Response:
        conflict = False
        auth_user = None
        action = request.GET.get('action', None)
        user_id = request.GET.get('user_id', None)
        code = request.GET.get('code', None)

        serializer = SSOSerializer(data=request.GET)
        if serializer.is_valid(raise_exception=True):
            if action == 'link':
                try:
                    auth_user = User.objects.get(pk=user_id)
                except User.DoesNotExist:
                    raise NotFound

            import requests

            response = requests.post('https://api.intra.42.fr/oauth/token', data={
                'grant_type': 'authorization_code',
                'client_id': os.environ.get('SSO_42_CLIENT_ID'),
                'client_secret': get_secret_from_file(os.environ.get('SSO_42_CLIENT_SECRET_FILE')),
                'code': code,
                'redirect_uri': os.environ.get('SSO_42_REDIRECT_URI')
            })
            if response.status_code == 200:
                request = requests.get(
                    'https://api.intra.42.fr/v2/me',
                    headers={
                        'Authorization': 'Bearer ' + response.json()['access_token']
                    }
                )
                user_info = request.json()
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
                        Avatar.objects.create(
                            auth_user=auth_user,
                            link=user_info.get('image').get('versions').get('medium')
                        )

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

        raise ServerError

    def callback(self, request, pk=None):
        if str(pk) == '101010':
            return self.sso_101010(request)
        else:
            raise ParseError("'" + str(pk) + "' " + _("is not a valid sso option"))

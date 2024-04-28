import secrets

import pyotp
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.response import Response

from api_auth.models import Avatar, SSO_User
from .models import OTP_Token
from .permissions import UserPermission, OTPPermission
from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer
from common.vault import resolveDataForm

import os
import hvac
from django.conf import settings
# import base64

# def decodeData(data):
#     return base64.b64decode(data).decode('utf-8')

# def transitDecrypt(ciphertext, client):
#     response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
#     return decodeData(response['data']['plaintext'])

# def resolveDataForm(data, client):
#     resolvedData = {}
#     for key, value in data.items():
#         if key == "password":
#             resolvedData[key] = transitDecrypt(value, client)
#         else:
#             resolvedData[key] = value
#     return resolvedData

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
        client = hvac.Client(url=os.environ['VAULT_ADDR'])
        if not client.is_authenticated():
            client.auth.approle.login(role_id=settings.VAULT_ROLE_ID, secret_id=settings.VAULT_SECRET_ID)

        resolvedData = resolveDataForm(request.data, client)
        serializer = CreateUserSerializer(data=resolvedData)
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
                'url': request.build_absolute_uri() + '/' + user.username
            }, status=status.HTTP_201_CREATED)
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
                    auth_user=user,
                    avatar=avatar,
                    request=request
                )
            return Response(None, status=status.HTTP_204_NO_CONTENT)
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

        # GDPR Anonymized User
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
        try:
            OTP_Token.objects.get(auth_user=user)
            return Response({
                'errors': {
                    'message': "User already has an active OTP",
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
        }, status=status.HTTP_201_CREATED)

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

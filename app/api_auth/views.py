import os

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from common.Vault import Vault
from common.utils import get_secret_from_file
from .models import SSO_User
from .permissions import TokenPermission, SSOPermission
from .serializers import AuthUserSerializer, APITokenObtainPairSerializer, TokenSerializer


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
            'client_id': os.environ.get('42_CLIENT_ID'),
            'client_secret': get_secret_from_file(os.environ.get('42_CLIENT_SECRET_FILE')),
            'code': code,
            'redirect_uri': os.environ.get('42_REDIRECT_URI')
        })
        if response.status_code == 200:
            user_info = requests.get('https://api.intra.42.fr/v2/me',
                                     headers={'Authorization': 'Bearer ' + response.json()['access_token']}).json()
            user, created, conflict = SSO_User.objects.get_or_create(
                action=action,
                auth_user=auth_user,
                sso_provider='101010',
                sso_id=user_info.get('id'),
                username=user_info.get('login'),
                email=user_info.get('email'),
                image_link=user_info.get('image').get('link')
            )

            if action == 'link':
                return Response({}, status=status.HTTP_201_CREATED)
            else:
                refresh_token = APITokenObtainPairSerializer.get_token(user)

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

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Avatar


######################
####  /api/users  ####
######################


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ('avatar', 'link')


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    @staticmethod
    def get_avatar(obj):
        try:
            avatar_obj = Avatar.objects.get(user=obj)
            avatar_serializer = AvatarSerializer(avatar_obj)
            link = avatar_serializer.data['link']
            if link:
                return {
                    "link": link
                }
            return None
        except Avatar.DoesNotExist:
            return None

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', 'is_active', 'date_joined')


class CreateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'avatar')


class UpdateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'avatar')
        extra_kwargs = {
            'username': {'required': False},
            'password': {'required': False}
        }


#######################
##### /api/tokens #####
#######################

class AuthUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[])

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'username': {'required': False}
        }


class APITokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # token['scope'] = 'public'

        return token


class TokenSerializer(serializers.Serializer):
    grant_type = serializers.CharField()
    password = serializers.CharField(required=False)
    refresh_token = serializers.CharField(required=False)

    def validate_grant_type(self, value):
        """
        Check if the grant_type is either 'password' or 'refresh_token'.
        """
        if value not in ['password', 'refresh_token']:
            raise serializers.ValidationError("This field must be 'password' or 'refresh_token'.")
        return value

    def validate(self, data):
        data = super().validate(data)

        """
        Validate fields based on the grant_type.
        """
        grant_type = data.get('grant_type')

        if grant_type == 'password':
            if not data.get('password'):
                raise serializers.ValidationError({"password": "This field is required."})
        elif grant_type == 'refresh_token':
            if not data.get('refresh_token'):
                raise serializers.ValidationError({"refresh_token": "This field is required."})

        return data

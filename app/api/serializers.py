from django.contrib.auth.models import User
from rest_framework import serializers

from api_auth.models import Avatar
from api_auth.serializers import AvatarSerializer


######################
####  /api/users  ####
######################

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    @staticmethod
    def get_avatar(user):
        try:
            avatar = Avatar.objects.get(auth_user=user)
            avatar_serializer = AvatarSerializer(avatar)
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

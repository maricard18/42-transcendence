from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ParseError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Avatar
from .models import OTP_Token


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ("avatar", "link")


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
            link = avatar_serializer.data["link"]
            if link:
                return {
                    "link": link
                }
            return None
        except Avatar.DoesNotExist:
            return None

    class Meta:
        model = User
        fields = ("id", "username", "email", "avatar", "is_active", "date_joined")


class CreateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "avatar")


class UpdateUserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "avatar")
        extra_kwargs = {
            "username": {"required": False},
            "password": {"required": False}
        }


##############################
##### /api/users/:id/otp #####
##############################

class CreateOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP_Token
        fields = ("auth_user",)


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP_Token
        fields = ("active", "created_at")

#######################
##### /auth/tokens ####
#######################

class AuthUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[])

    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {
            "username": {"required": False}
        }


class APITokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # token["scope"] = "public"

        return token


class TokenSerializer(serializers.Serializer):
    grant_type = serializers.CharField()
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    refresh_token = serializers.CharField(required=False)

    def validate_grant_type(self, value):
        if value not in ["password", "refresh_token"]:
            raise serializers.ValidationError(_("This field must be 'password' or 'refresh_token'."))
        return value

    def validate(self, data):
        data = super().validate(data)

        grant_type = data.get("grant_type")
        if grant_type == "password":
            if not data.get("password"):
                raise serializers.ValidationError({
                    "password": _("This field is required.")
                })
            if not data.get("email") and not data.get("username"):
                raise ParseError(_("Either 'email' or 'username' is required."))
        elif grant_type == "refresh_token":
            if not data.get("refresh_token"):
                raise serializers.ValidationError({
                    "refresh_token": _("This field is required.")
                })

        return data


#######################
#####  /auth/sso   ####
#######################

class SSOSerializer(serializers.Serializer):
    action = serializers.CharField()
    user_id = serializers.IntegerField(required=False)
    code = serializers.CharField()

    def validate_action(self, value):
        if value not in ["link", "register"]:
            raise serializers.ValidationError(_("This field must be 'link' or 'register'."))
        return value

    def validate(self, data):
        data = super().validate(data)

        action = data.get("action")
        if action == "link":
            if not data.get("user_id"):
                raise serializers.ValidationError({
                    "user_id": _("This field is required.")
                })

        return data

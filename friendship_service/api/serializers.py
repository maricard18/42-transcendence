from rest_framework import serializers

from .models import Friendship


class CreateFriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ("user_id", "friend_id")


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = "__all__"

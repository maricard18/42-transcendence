from rest_framework import serializers

from .models import Friendship


##########################
#### /api/friendships ####
##########################

class FriendIdFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ("friend_id",)


class CreateFriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ("user_id", "friend_id")

    def validate(self, data):
        if int(data['user_id']) == int(data['friend_id']):
            raise serializers.ValidationError()
        return data


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = "__all__"

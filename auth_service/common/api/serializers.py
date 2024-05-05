from rest_framework import serializers

from common.api.models import Avatar


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ('avatar', 'link')

from django.conf import settings
from rest_framework import serializers

from common.exceptions import ServerError
from .models import Game, GameResult, GamePlayer


######################
####  /api/games  ####
######################

class UserIdFilterSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()

    class Meta:
        model = Game
        fields = ("user_id",)


class CreateGamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamePlayer
        fields = ("players",)


class CreateGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = ("results",)


class CreateGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ("game", "type")


class GameSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    game = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    players = serializers.SerializerMethodField()
    results = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.id

    def get_game(self, obj):
        return obj.game

    def get_type(self, obj):
        return obj.type

    def get_players(self, obj):
        try:
            players = GamePlayer.objects.get(game=obj).players
        except GamePlayer.DoesNotExist:
            raise ServerError
        return {f"player_{index + 1}": player for index, player in enumerate(players)}

    def get_results(self, obj):
        try:
            results = GameResult.objects.get(game=obj).results
        except GameResult.DoesNotExist:
            raise ServerError
        return {f"player_{index + 1}": result for index, result in enumerate(results)}

    def get_date(self, obj):
        datetime_format = settings.REST_FRAMEWORK.get('DATETIME_FORMAT')
        return obj.created_at.strftime(datetime_format) if datetime_format else obj.created_at

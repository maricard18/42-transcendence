from rest_framework import viewsets, status
from rest_framework.exceptions import ValidationError, ParseError, NotFound
from rest_framework.response import Response

from common.Vault import Vault
from common.utils import generate_host
from .models import Game, GameResult, GamePlayer
from .permissions import GamePermission
from .serializers import CreateGameSerializer, CreateGamePlayerSerializer, CreateGameResultSerializer, GameSerializer


######################
####  /api/games  ####
######################

class GameViewSet(viewsets.ViewSet):
    permission_classes = [GamePermission]

    def list(self, request):
        id_filter = request.GET.get('filter[user_id]', None)
        if id_filter:
            game_players = GamePlayer.objects.filter(players__contains=[id_filter])
            game_ids = [game_player.game.id for game_player in game_players]
            queryset = Game.objects.filter(id__in=game_ids)
        else:
            queryset = Game.objects.all()

        serializer = GameSerializer(queryset, many=True)
        return Response(Vault.cipherSensitiveFields(
            serializer.data,
            request,
            Vault.transitEncrypt
        ), status=status.HTTP_200_OK)

    def create(self, request):
        def get_sorted_values(data: dict) -> list:
            value_list = []
            for key, value in sorted(data.items()):
                try:
                    index = int(key[len("player_"):]) - 1
                    value_list.insert(index, value)
                except ValueError:
                    raise ParseError
            return value_list

        game_serializer = CreateGameSerializer(data={
            "game": request.data.get("game", None),
            "type": request.data.get("type", None)
        })
        player_serializer = CreateGamePlayerSerializer(data={
            "players": get_sorted_values(request.data.get("players", {}))
        })
        result_serializer = CreateGameResultSerializer(data={
            "results": get_sorted_values(request.data.get("results", {}))
        })
        if not all([game_serializer.is_valid(), player_serializer.is_valid(), result_serializer.is_valid()]):
            serializer_errors = {}
            serializer_errors.update(game_serializer.errors)
            serializer_errors.update(player_serializer.errors)
            serializer_errors.update(result_serializer.errors)
            raise ValidationError(serializer_errors)

        game = Game.objects.create(
            game=game_serializer.validated_data.get("game", None),
            type=game_serializer.validated_data.get("type", None)
        )
        GamePlayer.objects.create(
            game=game,
            players=player_serializer.validated_data.get("players", None)
        )
        GameResult.objects.create(
            game=game,
            results=result_serializer.validated_data.get("results", None)
        )
        return Response(Vault.cipherSensitiveFields(
            {
                "id": game.id,
                "url": generate_host(request) + request.path + "/" + str(game.id)
            },
            request,
            Vault.transitEncrypt
        ), status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        try:
            game = Game.objects.get(pk=pk)
        except Game.DoesNotExist:
            raise NotFound

        serializer = GameSerializer(game)
        return Response(Vault.cipherSensitiveFields(
            serializer.data,
            request,
            Vault.transitEncrypt
        ), status=status.HTTP_200_OK)

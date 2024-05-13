from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Game(models.Model):
    game = models.CharField(
        _("game"),
        help_text=_("Required. pong or ttt."),
        choices=settings.AVAILABLE_GAMES
    )
    type = models.CharField(
        _("type"),
        help_text=_("Required. single or multi."),
        choices=settings.AVAILABLE_GAME_TYPES
    )
    created_at = models.DateTimeField(
        _("date created"),
        default=timezone.now,
        editable=False
    )

    objects = models.Manager()


class GameResult(models.Model):
    results = ArrayField(
        models.IntegerField(),
        blank=False,
        null=False,
        help_text=_("Required. The list of results from the game.")
    )
    game = models.OneToOneField(
        Game,
        on_delete=models.CASCADE,
        help_text=_("Required. The game associated to this entry.")
    )

    objects = models.Manager()


class GamePlayer(models.Model):
    players = ArrayField(
        models.IntegerField(),
        blank=False,
        null=False,
        help_text=_("Required. The list of users that played the game.")
    )
    game = models.OneToOneField(
        Game,
        on_delete=models.CASCADE,
        help_text=_("Required. The game associated to this entry.")
    )

    objects = models.Manager()

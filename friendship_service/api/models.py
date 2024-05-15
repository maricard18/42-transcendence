from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Friendship(models.Model):
    user_id = models.IntegerField(
        _("user_id"),
        help_text=_("Required.")
    )
    friend_id = models.IntegerField(
        _("friend_id"),
        help_text=_("Required.")
    )
    created_at = models.DateTimeField(
        _("date created"),
        default=timezone.now,
        editable=False
    )

    objects = models.Manager()

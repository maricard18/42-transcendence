from django.db import models
from django.db.models import CheckConstraint, Q, F
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

    class Meta:
        unique_together = ["user_id", "friend_id"]
        constraints = [
            CheckConstraint(check=~Q(friend_id=F('user_id')), name='no_self_friend')
        ]

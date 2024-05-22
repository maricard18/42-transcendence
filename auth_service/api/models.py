import os
import secrets
import unicodedata

from django.apps.registry import apps
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


######################
####   Managers   ####
######################

class AvatarManager(models.Manager):
    request = None

    def create(self, auth_user, avatar=None, request=None, link=None):
        if not all([auth_user, avatar, request]) and not all([auth_user, link]):
            raise ValueError(_(
                "All 'auth_user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'auth_user' and 'link' fields are required for Avatar, if not uploading an avatar."
            ))

        if avatar is not None:
            AvatarManager.request = request
            instance = super().create(auth_user=auth_user, avatar=avatar)
            AvatarManager.request = None
            return instance
        return super().create(auth_user=auth_user, avatar=avatar, link=link)

    def update_or_create(self, auth_user, avatar=None, request=None, link=None):
        if not all([auth_user, avatar, request]) and not all([auth_user, link]):
            raise ValueError(_(
                "All 'auth_user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'auth_user' and 'link' fields are required for Avatar, if not uploading an avatar."
            ))

        try:
            if avatar is not None or link is not None:
                old_avatar = Avatar.objects.get(auth_user=auth_user)
                if old_avatar.avatar and os.path.exists(old_avatar.avatar.path):
                    os.remove(old_avatar.avatar.path)
        except Avatar.DoesNotExist:
            pass

        try:
            avatar_obj = Avatar.objects.get(auth_user=auth_user)
            created = False
        except Avatar.DoesNotExist:
            avatar_obj = Avatar()
            avatar_obj.auth_user = auth_user
            created = True

        if avatar is not None:
            AvatarManager.request = request
            avatar_obj.avatar = avatar
            avatar_obj.save()
            AvatarManager.request = None
        else:
            avatar_obj.avatar = None
            avatar_obj.link = link
            avatar_obj.save()

        return avatar_obj, created


class SSO_UserManager(models.Manager):

    @staticmethod
    def normalize_email(email):
        """
        Normalize the email address by lowercasing the domain part of it.
        """
        email = email or ""
        try:
            email_name, domain_part = email.strip().rsplit("@", 1)
        except ValueError:
            pass
        else:
            email = email_name + "@" + domain_part.lower()
        return email

    def create_user(self, sso_provider, sso_id, username, email, auth_user):
        """
        Create and save a user with the given username, email, and password.
        """
        if not username:
            raise ValueError(_("The given username must be set."))
        email = self.normalize_email(email)
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)
        user = self.model(sso_provider=sso_provider, sso_id=sso_id, username=username, email=email, auth_user=auth_user)
        user.save(using=self._db)
        return user

    def get_or_create(self, defaults=None, **kwargs):
        created = False
        try:
            user = SSO_User.objects.get(
                sso_provider=kwargs["sso_provider"],
                sso_id=kwargs["sso_id"]
            )
        except SSO_User.DoesNotExist:
            user = SSO_User.objects.create_user(
                sso_provider=kwargs["sso_provider"],
                sso_id=kwargs["sso_id"],
                username=kwargs["username"],
                email=kwargs["email"],
                auth_user=kwargs["auth_user"]
            )
            created = True
        return user, created


######################
####    Models    ####
######################

def path_and_rename(instance, filename):
    upload_path = "avatars/"
    ext = filename.split(".")[-1]

    filename = "{}.{}".format(secrets.token_hex(), ext)
    instance.link = os.path.join("/", str(settings.MEDIA_ROOT).lstrip(str(settings.BASE_DIR)), upload_path, filename)
    return os.path.join(upload_path, filename)


class Avatar(models.Model):
    avatar = models.ImageField(
        _("avatar"),
        upload_to=path_and_rename
    )
    link = models.URLField(
        _("link"),
        help_text=_("Required. The URL to retrieve the image.")
    )
    auth_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        unique=True,
        help_text=_("Required. The user associated to the image."),
        error_messages={
            "unique": _("An avatar already exists for that user."),
        }
    )
    created_at = models.DateTimeField(
        _("date created"),
        default=timezone.now,
        editable=False
    )

    objects = AvatarManager()


class SSO_User(models.Model):
    sso_provider = models.CharField(
        _("sso_provider"),
        max_length=8,
        help_text=_("Required. The SSO used to signup/login.")
    )

    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_("Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        }
    )
    email = models.EmailField(
        _("email address"),
        blank=True,
    )
    sso_id = models.IntegerField(
        _("sso_id"),
        unique=True,
        help_text=_("Required. An unique identifier at the SSO identity."),
        error_messages={
            "unique": _("This account is already linked to an user."),
        }
    )
    auth_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        unique=True,
        help_text=_("Required. The user associated to the sso."),
        error_messages={
            "unique": _("This user is already linked to an account."),
        }
    )
    created_at = models.DateTimeField(
        _("date created"),
        default=timezone.now,
        editable=False
    )

    objects = SSO_UserManager()

    class Meta:
        unique_together = ["sso_provider", "sso_id"]

    @classmethod
    def normalize_username(cls, username):
        return (
            unicodedata.normalize("NFKC", username)
            if isinstance(username, str)
            else username
        )


class OTP_Token(models.Model):
    token = models.CharField(
        _("token"),
        max_length=40,
        unique=True
    )
    active = models.BooleanField(
        default=False
    )
    auth_user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        unique=True,
        help_text=_("Required. The user associated to the OTP token."),
        error_messages={
            "unique": _("This user already has 2FA enabled."),
        }
    )
    created_at = models.DateTimeField(
        _("date created"),
        default=timezone.now,
        editable=False
    )

    objects = models.Manager()

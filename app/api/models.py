import os
import secrets
import unicodedata

from django.apps.registry import apps
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models, IntegrityError


######################
####   Managers   ####
######################

class AvatarManager(models.Manager):
    request = None

    def create(self, user, avatar=None, request=None, link=None):
        if not all([user, avatar, request]) and not all([user, link]):
            raise ValueError(
                "All 'user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'user' and 'link' fields are required for Avatar, if not uploading an avatar."
            )

        if avatar is not None:
            AvatarManager.request = request
            instance = super().create(user=user, avatar=avatar)
            AvatarManager.request = None
            return instance
        return super().create(user=user, avatar=avatar, link=link)

    def update_or_create(self, user, avatar=None, request=None, link=None):
        if not all([user, avatar, request]) and not all([user, link]):
            raise ValueError(
                "All 'user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'user' and 'link' fields are required for Avatar, if not uploading an avatar."
            )

        try:
            if avatar is not None or link is not None:
                old_avatar = Avatar.objects.get(user=user)
                if old_avatar.avatar and os.path.exists(old_avatar.avatar.path):
                    os.remove(old_avatar.avatar.path)
        except Avatar.DoesNotExist:
            pass

        try:
            avatar_obj = Avatar.objects.get(user=user)
            created = False
        except Avatar.DoesNotExist:
            avatar_obj = Avatar()
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

    def create_user(self, sso, sso_id, username, email, user):
        """
        Create and save a user with the given username, email, and password.
        """
        if not username:
            raise ValueError("The given username must be set")
        email = self.normalize_email(email)
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)
        user = self.model(sso=sso, sso_id=sso_id, username=username, email=email, user=user)
        user.save(using=self._db)
        return user

    def get_or_create(self, defaults=None, **kwargs):
        user = None
        created = False
        conflict = False
        try:
            user = SSO_User.objects.get(
                sso=kwargs['sso'],
                sso_id=kwargs['sso_id']
            )
        except SSO_User.DoesNotExist:
            try:
                user = User.objects.create_user(
                    username=kwargs['username'],
                    email=kwargs['email']
                )
            except IntegrityError as e:
                if 'key value violates unique constraint "auth_user_username_key"' in str(e):
                    while True:
                        try:
                            user = User.objects.create_user(
                                username=secrets.token_hex(4),
                                email=kwargs['email']
                            )
                            conflict = True
                            break
                        except IntegrityError as e:
                            if 'key value violates unique constraint "auth_user_username_key"' in str(e):
                                continue

            SSO_User.objects.create_user(
                sso=kwargs['sso'],
                sso_id=kwargs['sso_id'],
                username=kwargs['username'],
                email=kwargs['email'],
                user=user
            )
            if kwargs['image_link'] is not None:
                Avatar.objects.create(user=user, link=kwargs['image_link'])
            created = True
        return user, created, conflict


######################
####    Models    ####
######################

def path_and_rename(instance, filename):
    upload_path = 'frontend/static/images/avatars/'
    ext = filename.split('.')[-1]

    filename = '{}.{}'.format(secrets.token_hex(), ext)
    instance.link = upload_path.replace('frontend', '') + filename
    return os.path.join(upload_path, filename)


class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    avatar = models.ImageField("avatar", upload_to=path_and_rename)
    link = models.URLField("link", help_text="The URL to retrieve the image.")

    objects = AvatarManager()


class SSO_User(models.Model):
    sso = models.CharField(
        "sso",
        max_length=8,
        help_text="Required. The SSO that was used to signup/login."
    )

    sso_id = models.IntegerField("sso_id", help_text="Required. An unique identifier at the SSO.")
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        "username",
        max_length=150,
        unique=True,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        validators=[username_validator],
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )
    email = models.EmailField("email address", blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)

    objects = SSO_UserManager()

    @classmethod
    def normalize_username(cls, username):
        return (
            unicodedata.normalize("NFKC", username)
            if isinstance(username, str)
            else username
        )

import os
import secrets

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


######################
####   Managers   ####
######################

class AvatarManager(models.Manager):
    request = None

    def create(self, auth_user, avatar=None, request=None, link=None):
        if not all([auth_user, avatar, request]) and not all([auth_user, link]):
            raise ValueError(
                "All 'auth_user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'auth_user' and 'link' fields are required for Avatar, if not uploading an avatar."
            )

        if avatar is not None:
            AvatarManager.request = request
            instance = super().create(auth_user=auth_user, avatar=avatar)
            AvatarManager.request = None
            return instance
        return super().create(auth_user=auth_user, avatar=avatar, link=link)

    def update_or_create(self, auth_user, avatar=None, request=None, link=None):
        if not all([auth_user, avatar, request]) and not all([auth_user, link]):
            raise ValueError(
                "All 'auth_user', 'avatar', and 'request' fields are required for Avatar, if uploading an avatar.\n"
                "All 'auth_user' and 'link' fields are required for Avatar, if not uploading an avatar."
            )

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


######################
####    Models    ####
######################

def path_and_rename(instance, filename):
    upload_path = 'avatar/'
    ext = filename.split('.')[-1]

    filename = '{}.{}'.format(secrets.token_hex(), ext)
    instance.link = '/' + os.path.basename(os.path.dirname(settings.MEDIA_ROOT)) + '/' + upload_path + filename
    return os.path.join(upload_path, filename)


class Avatar(models.Model):
    avatar = models.ImageField("avatar", upload_to=path_and_rename)
    link = models.URLField("link", help_text="The URL to retrieve the image.")
    auth_user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)

    objects = AvatarManager()

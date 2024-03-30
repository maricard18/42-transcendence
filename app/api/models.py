from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    avatar = models.ImageField(upload_to='frontend/static/images/avatars/')

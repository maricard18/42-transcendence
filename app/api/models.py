from django.contrib.auth.models import User
from django.db import models


######################
####    Models    ####
######################

class OTP_Token(models.Model):
    token = models.CharField(
        "token",
        max_length=40,
        unique=True
    )
    auth_user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)

    objects = models.Manager()

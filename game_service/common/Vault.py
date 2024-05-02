import base64
import os

import hvac
from django.conf import settings


class Vault:

    @classmethod
    def vaultClient(cls):
        client = hvac.Client(url=os.environ['VAULT_ADDR'])
        if not client.is_authenticated():
            client.auth.approle.login(role_id=settings.VAULT_ROLE_ID, secret_id=settings.VAULT_SECRET_ID)
        return client

    @classmethod
    def decodeData(cls, data):
        return base64.b64decode(data).decode('utf-8')

    @classmethod
    def transitDecrypt(cls, ciphertext):
        client = cls.vaultClient()

        response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
        return cls.decodeData(response['data']['plaintext'])

    @classmethod
    def resolveEncryptedFields(cls, data):
        resolved = {}
        for key, value in data.items():
            if key == "password" or key == "username" or key == "email":
                resolved[key] = cls.transitDecrypt(value)
            else:
                resolved[key] = value
        return resolved

    @classmethod
    def getVaultSecret(cls, path):
        client = cls.vaultClient()

        response = client.secrets.kv.v2.read_secret(path=path, mount_point='transcendence')
        secret = response['data']['data']
        return secret['key']

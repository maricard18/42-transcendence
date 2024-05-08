import base64
import os

import hvac
from django.conf import settings


class Vault:

    @classmethod
    def vaultClient(cls):
        cert_path = str(os.environ.get("SSL_CERT_PATH")) + str(os.environ.get("SSL_CERT_FILE"))
        key_path = str(os.environ.get("SSL_CERT_KEY_PATH")) + str(os.environ.get("SSL_CERT_KEY_FILE"))
        client = hvac.Client(
            url=os.environ.get("VAULT_ADDR"),
            verify=False,
            cert=(cert_path, key_path)
        )
        if not client.is_authenticated():
            client.auth.approle.login(role_id=settings.VAULT_ROLE_ID, secret_id=settings.VAULT_SECRET_ID)
        return client

    @classmethod
    def decodeData(cls, data):
        return base64.b64decode(data).decode('utf-8')

    @classmethod
    def encodeData(cls, data):
        return base64.b64encode(data.encode('utf-8')).decode('utf-8')

    @classmethod
    def transitDecrypt(cls, ciphertext):
        client = cls.vaultClient()

        response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
        return cls.decodeData(response['data']['plaintext'])

    @classmethod
    def transitEncrypt(cls, plaintext):
        client = cls.vaultClient()

        response = client.secrets.transit.encrypt_data(name="transcendence", plaintext=cls.encodeData(plaintext))
        return response['data']['ciphertext']

    @classmethod
    def resolveEncryptedFields(cls, data, request):
        resolved = {}
        for key, value in data.items():
            overwrite = settings.DEBUG and str(request.META['HTTP_USER_AGENT']).startswith("PostmanRuntime/")
            if (key == "password" or key == "username" or key == "email") and not overwrite:
                resolved[key] = cls.transitDecrypt(value)
            else:
                resolved[key] = value
        return resolved
    
    @classmethod
    def encryptSerializedData(cls, data):
        encrypted = {}
        for key, value in data.items():
            if key == "password" or key == "username" or key == "email":
                encrypted[key] = cls.transitEncrypt(value)
            else:
                encrypted[key] = value
        return encrypted

    @classmethod
    def getVaultSecret(cls, path):
        client = cls.vaultClient()

        response = client.secrets.kv.v2.read_secret(path=path, mount_point='transcendence')
        secret = response['data']['data']
        return secret['key']

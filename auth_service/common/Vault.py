import base64
import json
import os
from typing import Union, Callable

import hvac
from django.conf import settings
from django.http import HttpRequest


class Vault:

    @classmethod
    def overwrite(cls, request: HttpRequest) -> bool:
        return settings.DEBUG and str(request.META["HTTP_USER_AGENT"]).startswith("PostmanRuntime/")

    @classmethod
    def vaultClient(cls) -> hvac.Client:
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
    def decodeData(cls, data: str) -> str:
        return base64.b64decode(data).decode("utf-8")

    @classmethod
    def encodeData(cls, data: str) -> str:
        return base64.b64encode(data.encode("utf-8")).decode("utf-8")

    @classmethod
    def transitDecrypt(cls, ciphertext: str) -> str:
        client = cls.vaultClient()

        response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
        return cls.decodeData(response["data"]["plaintext"])

    @classmethod
    def transitEncrypt(cls, plaintext: str) -> str:
        client = cls.vaultClient()

        response = client.secrets.transit.encrypt_data(name="transcendence", plaintext=cls.encodeData(plaintext))
        return response["data"]["ciphertext"]

    @classmethod
    def cipherSensitiveFields(cls, data: Union[dict, list], request: HttpRequest, func: Callable[[str], str]) \
            -> Union[dict, list]:
        def resolveFields(_data: dict) -> dict:
            resolved = {}
            for key, value in _data.items():
                if key in ["username", "email", "password"] and not cls.overwrite(request):
                    resolved[key] = func(value)
                else:
                    resolved[key] = value
            return resolved

        if isinstance(data, dict):
            return resolveFields(data)
        elif isinstance(data, list):
            data_list = []
            for instance in data:
                data_list.append(resolveFields(instance))
            return data_list
        return data

    @classmethod
    def cipherData(cls, data: Union[dict, list], request: HttpRequest, func: Callable[[str], str]) -> Union[str, dict]:
        if not cls.overwrite(request):
            return func(json.dumps(data))
        return data

    @classmethod
    def getVaultSecret(cls, path: str) -> str:
        client = cls.vaultClient()

        response = client.secrets.kv.v2.read_secret(path=path, mount_point="transcendence")
        secret = response["data"]["data"]
        return secret["key"]

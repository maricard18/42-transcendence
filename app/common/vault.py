import os
import hvac
from django.conf import settings
import base64

def vaultClient():
    client = hvac.Client(url=os.environ['VAULT_ADDR'])
    if not client.is_authenticated():
        client.auth.approle.login(role_id=settings.VAULT_ROLE_ID, secret_id=settings.VAULT_SECRET_ID)
    return client

def decodeData(data):
    return base64.b64decode(data).decode('utf-8')

def transitDecrypt(ciphertext, client):
    response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
    return decodeData(response['data']['plaintext'])

def resolveEncryptedFields(data, client):
    resolved = {}
    for key, value in data.items():
        if key == "password" or key == "username" or key == "email":
            resolved[key] = transitDecrypt(value, client)
        else:
            resolved[key] = value
    return resolved
import os
import hvac
from django.conf import settings
import base64

def decodeData(data):
    return base64.b64decode(data).decode('utf-8')

def transitDecrypt(ciphertext, client):
    response = client.secrets.transit.decrypt_data(name="transcendence", ciphertext=ciphertext)
    return decodeData(response['data']['plaintext'])

def resolveDataForm(data, client):
    resolvedData = {}
    for key, value in data.items():
        if key == "password":
            resolvedData[key] = transitDecrypt(value, client)
        else:
            resolvedData[key] = value
    return resolvedData
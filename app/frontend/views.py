from django.shortcuts import render
from django.http import JsonResponse
import os
# import hvac
# from django.conf import settings

# Create your views here.
def RenderIndex(request, *args, **kwargs):
	return render(request, 'frontend/index.html')

def GetEnvVars(request):
    # print("role_id: ", settings.VAULT_ROLE_ID)
    # print("secret_id: ", settings.VAULT_SECRET_ID)

    # client = hvac.Client(url=os.environ['VAULT_ADDR'])
    # print("client: ", client, flush=True)

    # if not client.is_authenticated():
    #     print("Vault exists but not authenticated", flush=True)
    #     client.auth.approle.login(role_id=settings.VAULT_ROLE_ID, secret_id=settings.VAULT_SECRET_ID)
    # else:
    #     print("Vault is authenticated", flush=True)
    
    # if client.is_authenticated():
    #     print("Vault now is authenticated", flush=True)
    # else:
    #     print("Vault still not authenticated", flush=True)

    data = {
        "client_id": os.environ.get('42_CLIENT_ID'),
        "redirect_uri": os.environ.get('42_REDIRECT_URI'),
    }
    return JsonResponse(data)
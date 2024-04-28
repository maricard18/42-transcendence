from django.shortcuts import render
from django.http import JsonResponse
import os
# Create your views here.
def RenderIndex(request, *args, **kwargs):
	return render(request, 'frontend/index.html')

def GetEnvVars(request):
    data = {
        "client_id": os.environ.get('42_CLIENT_ID'),
        "redirect_uri": os.environ.get('42_REDIRECT_URI'),
    }
    return JsonResponse(data)
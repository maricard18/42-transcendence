from django.shortcuts import render
import os

#context = {
#  "client_id": os.environ.get('42_CLIENT_ID'),
#  "client_secret": os.environ.get('42_CLIENT_SECRET'),
#  "redirect_uri": os.environ.get('42_REDIRECT_URI'),
#}


# Create your views here.
def RenderIndex(request, *args, **kwargs):
	return render(request, 'frontend/index.html')
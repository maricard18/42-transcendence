from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status, viewsets
from rest_framework.response import Response
from .serializers import UserSerializer, CreateUserSerializer

# Create your views here.


class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()

    # GET /api/users
    def list(self, request):
        return Response(UserSerializer(self.queryset, many=True).data)

    # POST /api/users/
    def create(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer_class = CreateUserSerializer
        serializer = serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = make_password(serializer.data.get('password'))

            user = User(username=username, password=password)
            user.save()

            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)

    # GET /api/users/:id
    def retrieve(self, request, pk=None):
        user = get_object_or_404(self.queryset, pk=pk)

        return Response(UserSerializer(user).data)

    ## PUT /api/users/:id
    # def update(self, request, pk=None):
    #     pass

    ## PATCH /api/users/:id
    # def partial_update(self, request, pk=None):
    #     pass

    ## DELETE /api/users/:id
    # def destroy(self, request, pk=None):
    #     pass

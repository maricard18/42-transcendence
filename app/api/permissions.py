from rest_framework import permissions


class UserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve', 'update', 'destroy']:
            return request.auth
        elif view.action == 'create':
            return True
        else:
            return False


class OTPPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ['create', 'retrieve', 'destroy']:
            return request.auth
        else:
            return False

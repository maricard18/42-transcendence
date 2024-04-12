from rest_framework import permissions


class TokenPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        else:
            return False


class SSOPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'callback':
            return True
        else:
            return False

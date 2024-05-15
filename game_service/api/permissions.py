from rest_framework import permissions


######################
####  /api/games  ####
######################

class GamePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ["list", "create", "retrieve"]:
            return request.auth
        else:
            return False

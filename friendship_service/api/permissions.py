from rest_framework import permissions


##########################
#### /api/friendships ####
##########################

class FriendshipPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ["list", "create", "retrieve", "destroy"]:
            return request.auth
        else:
            return False

    def has_object_permission(self, request, view, obj):
        own_resource = int(request.user.id) == int(obj)
        if view.action in ["retrieve", "destroy"] and own_resource:
            return request.auth
        else:
            return False

from rest_framework import permissions


######################
####  /api/users  ####
######################

class UserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ['list', 'retrieve', 'update', 'destroy']:
            return request.auth
        elif view.action == 'create':
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        own_resource = int(request.user.id) == int(obj)
        if view.action in ['update', 'destroy'] and own_resource:
            return request.auth
        else:
            return False


##############################
####  /api/users/:id/otp  ####
##############################

class OTPPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        own_resource = int(request.user.id) == int(obj)
        if view.action in ['create', 'retrieve', 'destroy'] and own_resource:
            return request.auth
        else:
            return False


########################
####  /auth/tokens  ####
########################

class TokenPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        else:
            return False


#####################
####  /auth/sso  ####
#####################

class SSOPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'callback':
            return True
        else:
            return False

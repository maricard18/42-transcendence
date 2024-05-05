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


##############################
####  /api/users/:id/otp  ####
##############################

class OTPPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action in ['create', 'retrieve', 'destroy']:
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

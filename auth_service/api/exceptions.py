from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


class ServerError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _('Internal Server Error')
    default_code = 'server_error'


def handler(exc, context):
    if isinstance(exc, ValidationError):
        codes = exc.get_codes()
        for field in codes:
            if 'unique' in codes.get(field):
                return Response({
                    'errors': exc.detail,
                }, status=status.HTTP_409_CONFLICT)
        return Response({
            'errors': exc.detail,
        }, exc.status_code)

    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    if response:
        return Response({
            'errors': {
                'message': response.data.get('detail').strip('.'),
                'code': response.status_code
            }
        }, status=response.status_code)

from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['detail'] = response.data['detail'].strip('.')
        response.data['status_code'] = response.status_code

        return Response({'errors': {'message': response.data.get('detail'), 'code': response.status_code}},
                        status=response.status_code)


def get_host(request):
    path = request.get_full_path()
    return request.build_absolute_uri().replace(path, '')

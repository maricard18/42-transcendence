from django.http import HttpRequest


def get_host(request: HttpRequest) -> str:
    path = request.get_full_path()
    return request.build_absolute_uri().replace(path, "")

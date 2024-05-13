from typing import Union

from django.http import HttpRequest


def get_secret_from_file(path: str) -> Union[str, None]:
    if path:
        file = open(str(path), "r")
        content = None
        for line in file:
            content = line.strip()
            break
        file.close()
        return content
    return None


def remove_sensitive_information(user_pk: int, data: Union[dict, list]) -> Union[dict, list]:
    def hide_email(user_data: dict) -> None:
        if "id" in user_data and int(user_data["id"]) != user_pk:
            if "email" in user_data:
                user_data["email"] = "[hidden]"

    if isinstance(data, list):
        for user in data:
            hide_email(user)
    elif isinstance(data, dict):
        hide_email(data)

    return data


def generate_host(request: HttpRequest) -> str:
    scheme = request.headers.get("X-Forwarded-Proto")
    host = request.headers.get("Host")
    port = ""
    if request.headers.get("X-Forwarded-Port") not in ["80", "443"]:
        port = request.headers.get("X-Forwarded-Port")
    return f"{scheme}://{host}:{port}"

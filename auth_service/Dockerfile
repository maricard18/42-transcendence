# FIRST STAGE -- BUILD
FROM python:3.11-slim as build
LABEL authors="bsilva-c"

RUN mkdir -p /tmp/daphne/

RUN chmod o+rw /tmp/daphne/

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target /site-packages/

# SECOND STAGE -- DEV
FROM python:3.11-slim as dev
LABEL authors="bsilva-c"

EXPOSE 8000

ENV PYTHONPATH="/site-packages/"

ENV DJANGO_SETTINGS_MODULE="auth_service.settings"
ENV DJANGO_DEBUG=True

COPY --from=build /site-packages/ /site-packages/
COPY --from=build /tmp/daphne/ /tmp/daphne/

WORKDIR /app/

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# SECOND STAGE -- PROD
FROM gcr.io/distroless/python3-debian12 as prod
LABEL authors="bsilva-c"

USER nonroot

ENV PYTHONPATH="/site-packages/"

ENV DJANGO_SETTINGS_MODULE="auth_service.settings"
ENV DJANGO_DEBUG=False

COPY --from=build /site-packages/ /site-packages/
COPY --from=build --chown=nonroot:nonroot /tmp/daphne/ /tmp/daphne/

WORKDIR /app/
COPY . .

CMD ["/site-packages/bin/daphne", "-u", "/tmp/daphne/daphne.sock", "auth_service.asgi:application"]

# SECOND STAGE -- TOOLS
FROM python:3.11-slim as tools
LABEL authors="bsilva-c"

ENV PYTHONPATH="/site-packages/"

COPY --from=build /site-packages/ /site-packages/

WORKDIR /app/
COPY . .

WORKDIR /app/tools/
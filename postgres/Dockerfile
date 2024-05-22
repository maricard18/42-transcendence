FROM postgres:13-alpine3.18
LABEL authors="bsilva-c"

RUN apk add --no-cache vault yq

COPY --chmod=665 ./tools/docker-entrypoint.sh /usr/local/bin/
COPY --chmod=665 ./tools/docker-healthcheck.sh /usr/local/bin/

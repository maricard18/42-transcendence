# FIRST STAGE -- BUILD
FROM owasp/modsecurity-crs:4.1-nginx-alpine-202404070904 as build
LABEL authors="bsilva-c"

USER root

ARG SSL_CERT
ARG SSL_CERT_KEY

RUN apk update && apk add --no-cache openssl

# Generate TLS Certificate
RUN mkdir -p "$(dirname "$SSL_CERT")"
RUN mkdir -p "$(dirname "$SSL_CERT_KEY")"
RUN openssl req -x509 -nodes -sha256 -newkey rsa:4096 \
    -subj "/C=PT/ST=Porto/L=Porto/O=42/OU=42Porto/CN=localhost" \
    -keyout "$SSL_CERT_KEY" \
    -out "$SSL_CERT"

# SECOND STAGE
FROM owasp/modsecurity-crs:4.1-nginx-alpine-202404070904
LABEL authors="bsilva-c"

USER root
EXPOSE 8080 8443

ARG SSL_CERT
ARG SSL_CERT_KEY

COPY --from=build --chown=nginx:nginx $SSL_CERT $SSL_CERT
COPY --from=build --chown=nginx:nginx $SSL_CERT_KEY $SSL_CERT_KEY

COPY modsecurity-nginx/conf.d/default.conf /etc/nginx/templates/conf.d/default.conf.template
COPY modsecurity-nginx/includes/location_auth_service.conf /etc/nginx/templates/includes/location_auth_service.conf.template
COPY modsecurity-nginx/includes/location_game_service.conf /etc/nginx/templates/includes/location_game_service.conf.template
COPY modsecurity-nginx/includes/location_web_service.conf /etc/nginx/templates/includes/location_web_service.conf.template
COPY modsecurity-nginx/includes/location_web_service_core.conf /etc/nginx/templates/includes/location_web_service_core.conf.template

WORKDIR /usr/share/nginx/html/
RUN rm -rf *

USER nginx

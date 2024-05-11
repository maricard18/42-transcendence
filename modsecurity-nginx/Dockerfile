# FIRST STAGE -- BUILD
FROM owasp/modsecurity-crs:4.1-nginx-alpine-202404070904 as build
LABEL authors="bsilva-c"

USER root

ARG SSL_CERT_PATH
ARG SSL_CERT_FILE
ARG SSL_CERT=${SSL_CERT_PATH}${SSL_CERT_FILE}

ARG SSL_CERT_KEY_PATH
ARG SSL_CERT_KEY_FILE
ARG SSL_CERT_KEY=${SSL_CERT_KEY_PATH}${SSL_CERT_KEY_FILE}

RUN apk update && apk add --no-cache openssl
    

# Generate TLS Certificate
RUN mkdir -p /etc/ssl/
RUN mkdir -p $SSL_CERT_PATH
RUN mkdir -p $SSL_CERT_KEY_PATH

COPY modsecurity-nginx/req.cnf /etc/ssl/req.cnf
RUN openssl req -x509 -nodes -sha256 -newkey rsa:4096 -days 730 \
    -config /etc/ssl/req.cnf -keyout "${SSL_CERT_KEY}" -out "${SSL_CERT}"

RUN chmod o+r ${SSL_CERT}
RUN chmod o+r ${SSL_CERT_KEY}

COPY modsecurity-nginx/conf.d/default.conf /etc/nginx/templates/conf.d/default.conf.template
COPY modsecurity-nginx/includes/location_auth_service.conf /etc/nginx/templates/includes/location_auth_service.conf.template
COPY modsecurity-nginx/includes/location_game_service.conf /etc/nginx/templates/includes/location_game_service.conf.template
COPY modsecurity-nginx/includes/location_web_service.conf /etc/nginx/templates/includes/location_web_service.conf.template
COPY modsecurity-nginx/includes/location_web_service_core.conf /etc/nginx/templates/includes/location_web_service_core.conf.template
COPY modsecurity-nginx/includes/server_vault_service.conf /etc/nginx/templates/includes/server_vault_service.conf.template
COPY modsecurity-nginx/includes/stub_status_nginx.conf /etc/nginx/templates/includes/stub_status_nginx.conf.template

# SECOND STAGE
FROM owasp/modsecurity-crs:4.1-nginx-alpine-202404070904 as dev
LABEL authors="bsilva-c"

USER root
EXPOSE 8080 8200 8443 9125

ARG SSL_CERT_PATH
ARG SSL_CERT_KEY_PATH

COPY --from=build $SSL_CERT_PATH $SSL_CERT_PATH
COPY --from=build $SSL_CERT_KEY_PATH $SSL_CERT_KEY_PATH
COPY modsecurity-nginx/telegraf.conf /etc/telegraf/telegraf.conf

COPY --from=build /etc/nginx/templates/ /etc/nginx/templates/

WORKDIR /usr/share/nginx/html/
RUN rm -rf *

COPY ./web_service/index.html ./index.html

RUN mkdir -p /var/log/telegraf
RUN touch /var/log/telegraf/transcendence-access.log /var/log/telegraf/transcendence-error.log
RUN chmod 755 /var/log/telegraf/transcendence-access.log /var/log/telegraf/transcendence-error.log
RUN apk add --no-cache telegraf

# SECOND STAGE
FROM owasp/modsecurity-crs:4.1-nginx-alpine-202404070904 as prod
LABEL authors="bsilva-c"

USER root
EXPOSE 8080 8200 8443 9125

ARG SSL_CERT_PATH
ARG SSL_CERT_KEY_PATH

COPY --from=build $SSL_CERT_PATH $SSL_CERT_PATH
COPY --from=build $SSL_CERT_KEY_PATH $SSL_CERT_KEY_PATH
COPY modsecurity-nginx/telegraf.conf /etc/telegraf/telegraf.conf

COPY --from=build /etc/nginx/templates/ /etc/nginx/templates/

WORKDIR /usr/share/nginx/html/
RUN rm -rf *

RUN touch /var/log/nginx/transcendence-access.log /var/log/nginx/transcendence-error.log
RUN chmod 755 /var/log/nginx/transcendence-access.log /var/log/nginx/transcendence-error.log
RUN apk add --no-cache telegraf

USER nginx

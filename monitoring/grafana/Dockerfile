FROM grafana/grafana:latest

USER root

ARG PROMETHEUS_URL

ARG SSL_CERT_PATH
ARG SSL_CERT_FILE
ARG SSL_CERT=${SSL_CERT_PATH}${SSL_CERT_FILE}

ARG SSL_CERT_KEY_PATH
ARG SSL_CERT_KEY_FILE
ARG SSL_CERT_KEY=${SSL_CERT_KEY_PATH}${SSL_CERT_KEY_FILE}

ARG SSL_CONFIG=/etc/ssl/req.cnf

RUN apk update && apk add --no-cache openssl gettext

# Generate TLS Certificate
RUN mkdir -p /etc/ssl/
RUN mkdir -p $SSL_CERT_PATH
RUN mkdir -p $SSL_CERT_KEY_PATH

COPY ./req.cnf "${SSL_CONFIG}"
RUN openssl req -x509 -nodes -sha256 -newkey rsa:4096 -days 730 \
    -config "${SSL_CONFIG}" -keyout "${SSL_CERT_KEY}" -out "${SSL_CERT}"

RUN chown 472:472 ${SSL_CERT}
RUN chown 472:472 ${SSL_CERT_KEY}

ENV GF_INSTALL_PLUGINS "grafana-worldmap-panel,grafana-piechart-panel,yesoreyeram-boomtheme-panel,briangann-gauge-panel,pierosavi-imageit-panel,bessler-pictureit-panel,vonage-status-panel"

COPY ./provisioning /etc/grafana/provisioning
COPY ./dashboards /etc/grafana/dashboards
COPY ./grafana.ini /etc/grafana/grafana.ini.template

RUN envsubst '$SSL_CERT_PATH $SSL_CERT_FILE $SSL_CERT_KEY_PATH $SSL_CERT_KEY_FILE' < /etc/grafana/grafana.ini.template > /etc/grafana/grafana.ini

RUN chmod 755 /etc/grafana/provisioning/datasources/datasources.yml

RUN sed -i 's|$PROMETHEUS_URL|'"$PROMETHEUS_URL"'|g' /etc/grafana/provisioning/datasources/datasources.yml

USER 472
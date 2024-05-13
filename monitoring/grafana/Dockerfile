FROM grafana/grafana:latest

USER root

ARG PROMETHEUS_URL
ARG PROMETHEUS_USER
ARG PROMETHEUS_PASSWORD

ENV GF_INSTALL_PLUGINS "grafana-worldmap-panel,grafana-piechart-panel,yesoreyeram-boomtheme-panel,briangann-gauge-panel,pierosavi-imageit-panel,bessler-pictureit-panel,vonage-status-panel"

COPY ./provisioning /etc/grafana/provisioning
COPY ./dashboards /etc/grafana/dashboards

RUN chmod 755 /etc/grafana/provisioning/datasources/datasources.yml

RUN sed -i 's|$PROMETHEUS_URL|'"$PROMETHEUS_URL"'|g' /etc/grafana/provisioning/datasources/datasources.yml && \
    sed -i 's|$PROMETHEUS_USER|'"$PROMETHEUS_USER"'|g' /etc/grafana/provisioning/datasources/datasources.yml && \
    sed -i 's|$PROMETHEUS_PASSWORD|'"$PROMETHEUS_PASSWORD"'|g' /etc/grafana/provisioning/datasources/datasources.yml

USER 472
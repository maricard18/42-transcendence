FROM grafana/grafana:latest

ARG PROMETHEUS_URL
ARG PROMETHEUS_USER
ARG PROMETHEUS_PASSWORD

ENV GF_INSTALL_PLUGINS "grafana-worldmap-panel,grafana-piechart-panel,yesoreyeram-boomtheme-panel,briangann-gauge-panel,pierosavi-imageit-panel,bessler-pictureit-panel,vonage-status-panel"

ADD ./provisioning /etc/grafana/provisioning
ADD ./dashboards /etc/grafana/dashboards

RUN sed -i 's|$PROMETHEUS_URL|'"$PROMETHEUS_URL"'|g' /etc/grafana/provisioning/datasources/datasources.yml && \
    sed -i 's|$PROMETHEUS_USER|'"$PROMETHEUS_USER"'|g' /etc/grafana/provisioning/datasources/datasources.yml && \
    sed -i 's|$PROMETHEUS_PASSWORD|'"$PROMETHEUS_PASSWORD"'|g' /etc/grafana/provisioning/datasources/datasources.yml
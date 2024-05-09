FROM grafana/grafana:latest

ARG PROMETHEUS_URL

ENV GF_AUTH_DISABLE_LOGIN_FORM "true"
ENV GF_AUTH_ANONYMOUS_ENABLED "true"
ENV GF_AUTH_ANONYMOUS_ORG_ROLE "Admin"
ENV GF_INSTALL_PLUGINS "grafana-worldmap-panel,grafana-piechart-panel,yesoreyeram-boomtheme-panel,briangann-gauge-panel,pierosavi-imageit-panel,bessler-pictureit-panel,vonage-status-panel"

ADD ./provisioning /etc/grafana/provisioning
ADD ./dashboards /etc/grafana/dashboards

RUN sed -i 's|$PROMETHEUS_URL|'"$PROMETHEUS_URL"'|g' /etc/grafana/provisioning/datasources/datasources.yml
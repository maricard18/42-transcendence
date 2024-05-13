FROM prom/prometheus:latest

ARG PROMETHEUS_ADDR

ARG TELEGRAF_ADDR
ARG CADVISOR_ADDR
ARG NODE_EXPORTER_ADDR
ARG ALERTMANAGER_ADDR

ADD ./prometheus.yml /etc/prometheus/prometheus.yml
ADD ./rules.yml /etc/prometheus/rules.yml

RUN sed -i 's|$PROMETHEUS_ADDR|'"$PROMETHEUS_ADDR"'|g' /etc/prometheus/prometheus.yml && \
    sed -i 's|$TELEGRAF_ADDR|'"$TELEGRAF_ADDR"'|g' /etc/prometheus/prometheus.yml && \
    sed -i 's|$CADVISOR_ADDR|'"$CADVISOR_ADDR"'|g' /etc/prometheus/prometheus.yml && \
    sed -i 's|$NODE_EXPORTER_ADDR|'"$NODE_EXPORTER_ADDR"'|g' /etc/prometheus/prometheus.yml && \
    sed -i 's|$ALERTMANAGER_ADDR|'"$ALERTMANAGER_ADDR"'|g' /etc/prometheus/prometheus.yml

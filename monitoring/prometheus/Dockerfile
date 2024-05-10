FROM prom/prometheus:latest

ARG PROMETHEUS_ADDR
ARG TELEGRAF_ADDR

ADD ./prometheus.yml /etc/prometheus/prometheus.yml

RUN sed -i 's|$PROMETHEUS_ADDR|'"$PROMETHEUS_ADDR"'|g' /etc/prometheus/prometheus.yml && \
    sed -i 's|$TELEGRAF_ADDR|'"$TELEGRAF_ADDR"'|g' /etc/prometheus/prometheus.yml

FROM prom/alertmanager:latest

ARG SLACK_ALERTMANAGER_WEBHOOK
ARG SLACK_ALERTMANAGER_CHANNEL

ADD ./alert.yml /etc/alertmanager/alert.yml

RUN sed -i 's|$SLACK_ALERTMANAGER_WEBHOOK|'"$SLACK_ALERTMANAGER_WEBHOOK"'|g' /etc/alertmanager/alert.yml && \
    sed -i 's|$SLACK_ALERTMANAGER_CHANNEL|'"$SLACK_ALERTMANAGER_CHANNEL"'|g' /etc/alertmanager/alert.yml

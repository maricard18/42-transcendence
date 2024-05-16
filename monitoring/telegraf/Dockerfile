FROM telegraf:1.30.2-alpine

EXPOSE 9125

ARG NGINX_METRICS_URL

ADD ./telegraf.conf /etc/telegraf/telegraf.conf
RUN sed -i 's|$NGINX_METRICS_URL|'"$NGINX_METRICS_URL"'|g' /etc/telegraf/telegraf.conf
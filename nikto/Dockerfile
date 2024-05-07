FROM alpine/git:2.43.0
LABEL authors="bsilva-c"

RUN apk update && apk add --no-cache perl perl-net-ssleay

RUN git clone https://github.com/sullo/nikto

ENTRYPOINT [ "/bin/sh", "-c", "./nikto/program/nikto.pl -h $WEB_ADDR -ssl -D P -C all -o nikto_report -Format htm" ]

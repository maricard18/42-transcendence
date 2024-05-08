FROM alpine/git:2.43.0
LABEL authors="bsilva-c"

RUN apk update && apk add --no-cache perl perl-net-ssleay

RUN git clone https://github.com/sullo/nikto

RUN mkdir -p /git/nikto/output/
RUN chmod o+rw -R /git/nikto/output/
WORKDIR /git/nikto/output/

ENTRYPOINT [ "/bin/sh", "-c", "/git/nikto/program/nikto.pl -h $WEB_ADDR -ssl -D P -C all -o . -Format htm" ]

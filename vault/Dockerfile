FROM hashicorp/vault:1.13.3 as build
LABEL authors="bsilva-c"

RUN apk update && apk add --no-cache gettext

RUN mkdir -p /vault/config/template/

COPY ./config/vault-config.json /vault/config/template/vault-config.json.template

ARG SSL_CERT_PATH
ARG SSL_CERT_KEY_PATH

RUN envsubst '$SSL_CERT_PATH $SSL_CERT_KEY_PATH' < /vault/config/template/vault-config.json.template > /vault/config/vault-config.json

FROM hashicorp/vault:1.13.3 as service
LABEL authors="bsilva-c"

COPY --from=build /vault/config/vault-config.json /vault/config/vault-config.json

ENTRYPOINT [ "vault", "server", "-config=/vault/config/vault-config.json" ]

FROM hashicorp/vault:1.13.3 as init
LABEL authors="bsilva-c"

RUN apk update && apk add --no-cache jq openssl

COPY ./policies/  /vault/policies/
COPY ./scripts/  /vault/scripts/

ENTRYPOINT [ "/bin/sh", "/vault/scripts/init.sh"]
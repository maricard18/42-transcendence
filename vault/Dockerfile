FROM hashicorp/vault:1.13.3 as service
LABEL authors="bsilva-c"

COPY ./config/ /vault/config/

ENTRYPOINT [ "vault", "server", "-config=/vault/config/vault-config.json" ]

FROM hashicorp/vault:1.13.3 as init
LABEL authors="bsilva-c"

COPY ./policies/  /vault/policies/
COPY ./scripts/  /vault/scripts/

ENTRYPOINT [ "/bin/sh", "/vault/scripts/init.sh"]
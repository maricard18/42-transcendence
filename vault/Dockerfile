# FIRST STAGE -- BUILD
FROM hashicorp/vault:latest as build
LABEL authors="wcorrea-"

# SECOND STAGE -- DEV
FROM hashicorp/vault:latest as dev
LABEL authors="wcorrea-"

COPY conf/ /tmp
RUN chmod +x /tmp/setup.sh
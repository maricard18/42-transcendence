#!/bin/bash

vault login $VAULT_DEV_ROOT_TOKEN_ID

vault secrets enable transit
vault write -f transit/keys/transcendence
vault policy write transcendence-policy /tmp/policy.hcl

# ------- AppRole Auth Method -------
# vault auth enable approle
# vault write auth/approle/role/transcendence-role token_policies=transcendence-policy

# export ROLE_ID="$(vault read -field=role_id auth/approle/role/transcendence-role/role-id)"
# export SECRET_ID="$(vault write -f -field=secret_id auth/approle/role/transcendence-role/secret-id)"
# vault write auth/approle/login role_id="$ROLE_ID" secret_id="$SECRET_ID"
# ----------------------------------

vault write sys/config/cors allowed_origins="*" allowed_headers="*" allowed_methods="GET,POST,PUT,DELETE,OPTIONS"

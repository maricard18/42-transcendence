#! /bin/sh
 
set -ex
apk add jq
 
APP_NAME=transcendence
INIT_FILE=/vault/keys/vault.init
APP_INIT_FILE=/vault/${APP_NAME}/${APP_NAME}.init

if [[ -f "${INIT_FILE}" ]]; then
    echo "${INIT_FILE} exists. Vault already initialized."
else
  echo "Initializing Vault..."
  sleep 5
  vault operator init -key-shares=3 -key-threshold=2 | tee ${INIT_FILE} > /dev/null
  ### Store unseal keys to files
  COUNTER=1
  cat ${INIT_FILE} | grep '^Unseal' | awk '{print $4}' | for key in $(cat -); do
    echo "${key}" > /vault/keys/key-${COUNTER}
    COUNTER=$((COUNTER + 1))
  done
  ### Store Root Key to file
  cat ${INIT_FILE}| grep '^Initial Root Token' | awk '{print $4}' | tee /vault/root/token > /dev/null
  echo "Vault setup complete."
fi
 
if [ ! -s /vault/root/token -o ! -s /vault/keys/key-1 -o ! -s /vault/keys/key-2 ] ; then
    echo "Vault is initialized, but unseal keys or token are mssing"
    return
fi
echo "Unsealing Vault"
export VAULT_TOKEN=$(cat /vault/root/token)
vault operator unseal "$(cat /vault/keys/key-1)"
vault operator unseal "$(cat /vault/keys/key-2)"
 
vault status | grep "^Version" | awk '{print $2}' | tee /vault/${APP_NAME}/version > /dev/null

if [[ -f "${APP_INIT_FILE}" ]]; then
    echo "${APP_INIT_FILE} exists. Vault already initialized for ${APP_NAME}."
else
    echo "Enabling Secrets Engine for ${APP_NAME}..."
    vault secrets enable -path=${APP_NAME} kv-v2

    vault secrets enable transit
    vault write -f transit/keys/${APP_NAME}
 
    echo "Creating ${APP_NAME} Policy..."
    vault policy write ${APP_NAME} /vault/policies/${APP_NAME}.hcl
 
    echo "Enabling AppRole Auth Backend..."
    vault auth enable approle
 
    echo "Creating ${APP_NAME} Approle Auth Backend..."
    vault write auth/approle/role/${APP_NAME} token_policies=${APP_NAME} token_ttl=2h token_max_ttl=6h
    vault read auth/approle/role/${APP_NAME}
    vault read auth/approle/role/${APP_NAME}/role-id | grep "role_id" | awk '{print $2}' | tee /vault/${APP_NAME}/${APP_NAME}-role-id > /dev/null
    vault write -force auth/approle/role/${APP_NAME}/secret-id | grep "secret_id" | awk '{print $2}' | head -n 1 | tee /vault/${APP_NAME}/${APP_NAME}-role-secret-id > /dev/null

    vault write sys/config/cors allowed_origins="*" allowed_headers="*" allowed_methods="GET,POST,PUT,DELETE,OPTIONS"

    echo "${APP_NAME} Approle creation complete."
    touch ${APP_INIT_FILE}
fi
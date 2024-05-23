#!/bin/sh

set -euo pipefail

create_approle() {
  echo "Creating $1 Approle..."
  vault write auth/approle/role/"$1" token_policies="$1" token_ttl=2h token_max_ttl=6h
  vault read auth/approle/role/"$1"

  # Fetching and storing the role-id
  ROLE_ID_OUTPUT=$(vault read auth/approle/role/"$1"/role-id)
  echo "$ROLE_ID_OUTPUT"
  echo ""
  echo "$ROLE_ID_OUTPUT" | grep "role_id" | awk 'NR == 1 {print $2}' > /vault/"$1"/role-id

  # Fetching and storing the secret-id
  SECRET_ID_OUTPUT=$(vault write -force auth/approle/role/"$1"/secret-id)
  echo "$SECRET_ID_OUTPUT"
  echo ""
  echo "$SECRET_ID_OUTPUT" | grep "secret_id" | awk 'NR == 1 {print $2}' > /vault/"$1"/secret-id
  echo "$1 Approle creation complete."
}

VAULT_INIT_FILE="/vault/keys/vault.init"

echo ""
echo "Initializing Vault..."
if [ -f "${VAULT_INIT_FILE}" ]; then
    echo "Vault already initialized."
    echo ""
else
    vault operator init -key-shares=3 -key-threshold=2 | tee "${VAULT_INIT_FILE}" > /dev/null

    # Store unseal keys to files
    COUNTER=1
    grep '^Unseal' "${VAULT_INIT_FILE}" | awk '{print $4}' | while read -r key; do
        echo "${key}" > "/vault/keys/key-${COUNTER}"
        COUNTER=$((COUNTER + 1))
    done

    # Store Root Token to file
    grep '^Initial Root Token' "${VAULT_INIT_FILE}" | awk '{print $4}' > /vault/root/token

    echo "Vault initialization complete."
    echo ""
fi

# Check if all necessary files are present
if [ ! -s /vault/root/token ] || [ ! -s /vault/keys/key-1 ] || [ ! -s /vault/keys/key-2 ]; then
    echo "Vault initialized, but unseal keys or token are missing."
    exit 1
fi

# Check Vault seal status
echo "Unsealing Vault..."
export VAULT_TOKEN=$(cat /vault/root/token)
echo "${VAULT_TOKEN}"
if vault_status=$(vault status -format=json); then
    echo "Vault already unsealed."
    echo ""
else
    if echo "${vault_status}" | jq -e '.sealed' | grep -q 'true'; then
        vault operator unseal "$(cat /vault/keys/key-1)"
        vault operator unseal "$(cat /vault/keys/key-2)"
        echo "Vault unsealing complete."
        echo ""
    else
        echo "${vault_status}"
        exit 1
    fi
fi

PROJECT_NAME="transcendence"
PROJECT_INIT_FILE="/vault/${PROJECT_NAME}/.init"

echo "Initializing Project ${PROJECT_NAME}..."
if [ -f "${PROJECT_INIT_FILE}" ]; then
    echo "Project ${PROJECT_NAME} already initialized."
    echo ""
else
    echo "Creating ${PROJECT_NAME} Policy..."
    vault policy write "${PROJECT_NAME}" "/vault/policies/${PROJECT_NAME}.hcl"
    echo "${PROJECT_NAME} Policy created."

    echo "Enabling CORS for Vault..."
    vault write sys/config/cors allowed_origins="*" allowed_headers="*" allowed_methods="GET,POST,PUT,DELETE,OPTIONS"
    echo "CORS for Vault enabled..."

    echo "Enabling AppRole Auth Backend..."
    vault auth enable approle
    echo "AppRole Auth Backend enabled."

    create_approle "${PROJECT_NAME}"

    echo "Enabling Secrets Engine for ${PROJECT_NAME}..."
    vault secrets enable -path="${PROJECT_NAME}" kv-v2
    vault secrets enable transit
    vault write -f transit/keys/"${PROJECT_NAME}"
    echo "Secrets Engine for ${PROJECT_NAME} enabled."

    echo "Adding jwt-signing-key to ${PROJECT_NAME}..."
    vault kv put -mount="${PROJECT_NAME}" jwt-signing-key key="$(openssl rand -base64 32)"
    echo "jwt-signing-key added to ${PROJECT_NAME}..."

    touch "${PROJECT_INIT_FILE}"
    echo "Project ${PROJECT_NAME} initialization complete."
    echo ""
fi

# Loop through entities and initialize them
for entity in $VAULT_APPROLE_ENTITIES; do
    APP_NAME="$entity"
    APP_INIT_FILE="/vault/${APP_NAME}/.init"

    echo "Initializing Entity ${APP_NAME}..."
    mkdir -p /vault/"${APP_NAME}"
    if [ -f "${APP_INIT_FILE}" ]; then
        echo "Entity ${APP_NAME} already initialized."
        echo ""
    else
        echo "Creating ${APP_NAME} Policy..."
        vault policy write "${APP_NAME}" "/vault/policies/${APP_NAME}.hcl"
        echo "${APP_NAME} Policy created."

        create_approle "${APP_NAME}"

        echo "Enabling Secrets Engine for ${APP_NAME}..."
        vault secrets enable -path="${APP_NAME}" kv-v2
        echo "Secrets Engine for ${APP_NAME} enabled."

        echo "Adding django-secret to ${APP_NAME}..."
        vault kv put -mount="${APP_NAME}" django-secret key="$(openssl rand -base64 32)"
        echo "django-secret added to ${APP_NAME}."

        echo "Adding postgres-db to ${APP_NAME}..."
        vault kv put -mount="${APP_NAME}" postgres-db key="${PROJECT_NAME}"
        echo "postgres-db added to ${APP_NAME}."

        echo "Adding postgres-user to ${APP_NAME}..."
        vault kv put -mount="${APP_NAME}" postgres-user key="${APP_NAME}"
        echo "postgres-user added to ${APP_NAME}."

        echo "Adding postgres-password to ${APP_NAME}..."
        vault kv put -mount="${APP_NAME}" postgres-password key="$(openssl rand -base64 32)"
        echo "postgres-password added to ${APP_NAME}."

        if [ "${APP_NAME}" = "auth_service" ]; then
            echo "Adding sso-42-client-secret to ${APP_NAME}..."
            vault kv put -mount="${APP_NAME}" sso-42-client-secret key="$(cat "$SSO_42_CLIENT_SECRET_FILE")"
            echo "sso-42-client-secret added to ${APP_NAME}..."
        fi

        touch "${APP_INIT_FILE}"
        echo "Entity ${APP_NAME} initialization complete."
    fi
done

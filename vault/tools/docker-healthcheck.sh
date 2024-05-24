#!/bin/sh

set -euo pipefail

VAULT_TOKEN_FILE="/vault/root/token"
VAULT_KEYS_DIR="/vault/keys"
PROJECT_NAME="transcendence"

# Function to check if Vault is initialized
is_initialized() {
    vault status -format=json | jq -r .initialized
}

# Function to check if Vault is sealed
is_sealed() {
    vault status -format=json | jq -r .sealed
}

# Function to check if a policy exists
policy_exists() {
    policy_name=$1
    vault policy read "${policy_name}" > /dev/null 2>&1
}

# Function to check if a secret exists
kv_exists() {
    path=$1
    vault kv get "${path}" > /dev/null 2>&1
}

if [ "$(is_initialized)" != "true" ]; then
    echo "Vault is not initialized"
    exit 1
fi

if [ "$(is_sealed)" = "true" ]; then
    echo "Vault is sealed"
    exit 1
fi

if [ ! -s ${VAULT_TOKEN_FILE} ] || [ ! -s ${VAULT_KEYS_DIR}/key-1 ] || [ ! -s ${VAULT_KEYS_DIR}/key-2 ]; then
    echo "Vault initialized, but unseal keys or token are missing"
    exit 1
fi

# Export the Vault token
export VAULT_TOKEN="$(cat ${VAULT_TOKEN_FILE})"

if ! kv_exists ${PROJECT_NAME}; then
    echo "Project ${PROJECT_NAME} is not initialized"
    exit 1
fi

# Check if the project policy exists
if ! policy_exists ${PROJECT_NAME}; then
    echo "Project ${PROJECT_NAME} policy does not exist"
    exit 1
fi

if ! kv_exists ${PROJECT_NAME}/jwt-signing-key; then
    echo "jwt-signing-key for ${PROJECT_NAME} does not exist"
    exit 1
fi

# Check if each entity is initialized
for entity in ${VAULT_APPROLE_ENTITIES}; do
    if ! kv_exists "${entity}"; then
        echo "Project ${entity} is not initialized"
        exit 1
    fi

    if ! policy_exists "${entity}"; then
        echo "Policy for ${entity} does not exist"
        exit 1
    fi

    if ! kv_exists "${entity}"/django-secret; then
        echo "django-secret for ${entity} does not exist"
        exit 1
    fi

    if ! kv_exists "${entity}"/postgres-db; then
        echo "postgres-db for ${entity} does not exist"
        exit 1
    fi

    if ! kv_exists "${entity}"/postgres-user; then
        echo "postgres-user for ${entity} does not exist"
        exit 1
    fi

    if ! kv_exists "${entity}"/postgres-password; then
        echo "postgres-password for ${entity} does not exist"
        exit 1
    fi

    if [ "${entity}" = "auth_service" ]; then
        if ! kv_exists "${entity}"/sso-42-client-secret; then
            echo "sso-42-client-secret for ${entity} does not exist"
            exit 1
        fi
    fi
done

echo "Vault is healthy and fully initialized"
exit 0
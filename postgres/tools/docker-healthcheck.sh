VAULT_TOKEN="$(vault write auth/approle/login role_id="$(cat "$VAULT_ROLE_ID_FILE")" secret_id="$(cat "$VAULT_SECRET_ID_FILE")" -format=yaml | yq .auth.client_token)"
export VAULT_TOKEN=${VAULT_TOKEN}
POSTGRES_DB="$(vault read /"$VAULT_MOUNT"/data/postgres-db -format=yaml | yq .data.data.key)"
POSTGRES_USER="$(vault read /"$VAULT_MOUNT"/data/postgres-user -format=yaml | yq .data.data.key)"
POSTGRES_PASSWORD="$(vault read /"$VAULT_MOUNT"/data/postgres-password -format=yaml | yq .data.data.key)"

pg_isready -h "$(cat $POSTGRES_HOST_FILE)" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
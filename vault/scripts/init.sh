#! /bin/sh
 
set -ex
apk add jq
 
INIT_FILE=/vault/keys/vault.init
if [[ -f "${INIT_FILE}" ]]; then
    echo "${INIT_FILE} exists. Vault already initialized."
else
  echo "Initializing Vault..."
  sleep 5
  vault operator init -key-shares=3 -key-threshold=2 | tee ${INIT_FILE} > /dev/null ### 3 fragments, 2 are required to unseal
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
 
vault status
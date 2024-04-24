Config Vault in Dev Mode
1. Webpack precisa depender de Vault
2. Server iniciado unsealed e com token já gerado
3. pegar o root token gerado e fazer o export em VAULT_TOKEN
4. Ativar o secrets de transit
```shell
vault secrets enable transit
```
5. Criar as chaves de encriptação
```shell
vault write -f transit/keys/transcendence
```
6. criar a policy para autenticação
- A partir de um arquivo
```shell
vault policy write transit-policy /tmp/policy.hcl
```
- A partir de de heredoc
```shell
vault policy write transcendence-policy - << EOF
path "sys/mounts/transit" {
  capabilities = [ "create", "read", "update", "delete", "list" ]
}

path "sys/mounts" {
  capabilities = [ "read" ]
}

path "transit/*" {
  capabilities = [ "create", "read", "update", "delete", "list" ]
}

path "transit/encrypt/transcendence" {
   capabilities = [ "update" ]
}
path "transit/decrypt/transcendence" {
   capabilities = [ "update" ]
}
EOF
```
7. Ativar o metodo de autenticação AppRole
```shell
vault auth enable approle
```
8. Gerar a role para o AppRole
```shell
vault write auth/approle/role/transcendence-role \
    token_policies=transcendence-policy
```    
9. ler e exportar o role id
```shell
export ROLE_ID="$(vault read -field=role_id auth/approle/role/transcendence-role/role-id)"
```
10. gerar e exportar o secret id
```shell
export SECRET_ID="$(vault write -f -field=secret_id auth/approle/role/transcendence-role/secret-id)"
```
11. Autenticar o approle
```shell
vault write auth/approle/login role_id="$ROLE_ID" secret_id="$SECRET_ID"
```
12. Ativar o CORS
```shell
vault write sys/config/cors \
    allowed_origins="*" \
    allowed_headers="*" \
    allowed_methods="GET,POST,PUT,DELETE,OPTIONS"
```
## Testes

### Encriptar
```shell
vault write transit/encrypt/transcendence plaintext=$(echo -n "my secret data" | base64)
```
### Desencriptar
```shell
vault write transit/decrypt/transcendence ciphertext=vault:v1:text
echo "return_after_decoding" | base64 -d
```
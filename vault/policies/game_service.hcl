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

path "transcendence/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "game_service/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
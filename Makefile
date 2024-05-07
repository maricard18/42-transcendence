# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: bsilva-c <bsilva-c@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/15 17:36:39 by bsilva-c          #+#    #+#              #
#    Updated: 2024/05/02 20:01:35 by bsilva-c         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

PROJECT_NAME = ft_transcendence

##
#### Using Makefile to call specific docker compose profile
##
PROFILES = prod dev
PROFILE ?= dev

# Check if profile is valid
ifeq ($(filter $(PROFILE),$(PROFILES)),)
    $(error Invalid profile specified: `$(PROFILE)` Valid profiles are `$(PROFILES)`)
endif

ifeq ($(PROFILE),dev)
COMMAND = docker compose
else
COMMAND = docker compose -f docker-compose.prod.yml
endif

##
#### Using Makefile to call specific service
##

SERVICES = auth_service game_service web_service vault_service modsecurity
_SERVICE = $(SERVICE)

# Check if service is valid
ifdef SERVICE

ifeq ($(filter $(_SERVICE),$(SERVICES)),)
    $(error Invalid profile specified: `$(_SERVICE)`. Valid services are `$(SERVICES)`)
endif

ifeq ($(PROFILE),dev)
    _SERVICE = $(SERVICE)-dev
endif

endif

all: build up
build:
	@$(COMMAND) build --no-cache --with-dependencies $(_SERVICE)
up: build
	@$(COMMAND) up -d --no-build $(_SERVICE)
down:
	@$(COMMAND) down $(_SERVICE)
start:
	@$(COMMAND) start $(_SERVICE)
stop:
	@$(COMMAND) stop $(_SERVICE)
ps:
	@$(COMMAND) ps $(_SERVICE)
rm:
	@$(COMMAND) rm $(_SERVICE)
re: fclean all
clean: stop rm
fclean:
	$(call confirm)
	@$(COMMAND) down $(_SERVICE) --volumes
	@images=$$(docker image ls -q "$(PROJECT_NAME)-*"); \
	if [ -n "$$images" ]; then \
		docker image rm $$images -f; \
	fi
help:
	@echo "Usage: make [options] [target]"
	@echo "Options:"
	@echo "  SERVICE=SERVICE \t Perform TARGET on SERVICE"
	@echo "  PROFILE=PROFILE \t Perform TARGET on PROFILE"
	@echo ""
	@echo "Available services:"
	@echo "  $(SERVICES)"
	@echo ""
	@echo "Available profiles:"
	@echo "  $(PROFILES)"
.PHONY: all build up down start stop ps rm re clean fclean help

define confirm
	@printf "\033[1;33m"  # Yellow color for the warning message
	@printf "WARNING: This action will permanently remove images and associated volumes. Are you sure you want to proceed? "
	@printf "\033[0m[y/N] "  # Reset color
	@read response; \
	if [ "$$response" != "y" ]; then \
		printf "\033[0mAborted.\n"; \
		exit 1; \
	fi
endef

# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: bsilva-c <bsilva-c@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/15 17:36:39 by bsilva-c          #+#    #+#              #
#    Updated: 2024/05/23 20:59:48 by bsilva-c         ###   ########.fr        #
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

SERVICES = auth_service game_service friendship_service web_service vault_service \
			modsecurity nikto grafana prometheus telegraf alertmanager
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

# Macro function for confirmation message
define confirm
	@printf "\033[1;33m"  # Yellow color for the warning message
	@printf "%s " "$(1)"
	@printf "\033[0m[y/N] "  # Reset color
	@read response; \
	if [ "$$response" != "y" ]; then \
		exit 1; \
	fi
endef

all: build up
build:
	@$(COMMAND) build --no-cache $(_SERVICE)
up: build
	@$(COMMAND) up -d --no-recreate $(_SERVICE)
	@$(MAKE) --no-print-directory ps
down:
	@$(COMMAND) down $(_SERVICE)
start:
	@$(COMMAND) start $(_SERVICE)
stop:
	@$(COMMAND) stop $(_SERVICE)
logs:
	@$(COMMAND) logs $(_SERVICE)
ps:
	@$(COMMAND) ps $(_SERVICE)
rm:
	@$(COMMAND) rm $(_SERVICE)
re: fclean all
clean: stop rm
fclean:
	$(call confirm, "WARNING: This action will permanently remove images and associated volumes. Are you sure you want to proceed?")
	@$(COMMAND) down $(_SERVICE) --rmi all --volumes;
	@docker system df;
	@if [ -z "$(SERVICE)" ]; then \
		if [ $$(docker system df | grep 'Build Cache' | awk '{print $$6}') != 0B ]; then \
			echo ""; \
			echo -n "\033[1;33mWARNING: Dangling build cache found. Do you want to remove all dangling build cache? "; \
			printf "\033[0m[y/N] "; \
			read response; \
			if [ "$$response" = "y" ]; then \
				docker builder prune -f; \
				docker system df; \
			fi \
		fi \
	fi
help:
	@echo "Usage: make [OPTIONS] [COMMAND]"
	@echo "Options:"
	@echo "  SERVICE=service   Perform command on service"
	@echo "  PROFILE=profile   Perform command using specified profile"
	@echo ""
	@echo "Commands:"
	@echo "  build      Build or rebuild services"
	@echo "  down       Stop and remove containers, networks"
	@echo "  logs       View output from containers"
	@echo "  ps         List containers"
	@echo "  rm         Removes stopped service containers"
	@echo "  start      Start services"
	@echo "  stop       Stop services"
	@echo "  up         Create and start containers"
	@echo "  re         Stop and remove containers, networks, images, and volumes, then build, create and start containers."
	@echo "  clean      Stops and removes service containers"
	@echo "  fclean     Stop and remove containers, networks, images, and volumes"
	@echo "  help       Display this message"
	@echo ""
	@echo "Available services:"
	@echo "  $(SERVICES)"
	@echo ""
	@echo "Available profiles:"
	@echo "  $(PROFILES)"
.PHONY: all build up down start stop logs ps rm re clean fclean help

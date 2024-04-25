# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: wcorrea- <wcorrea-@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/15 17:36:39 by bsilva-c          #+#    #+#              #
#    Updated: 2024/04/25 17:12:44 by wcorrea-         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

PROJECT_NAME = ft_transcendence

PROFILES = prod dev
PROFILE ?= dev

# Check if profile is a valid profile
ifeq ($(filter $(PROFILE),$(PROFILES)),)
    $(error Invalid profile specified: {$(PROFILE)} Valid profiles are {$(PROFILES)})
endif


ifeq ($(PROFILE),dev)
COMMAND = docker compose --profile dev
# COMMAND = docker compose --profile test
else
COMMAND = docker compose
endif

all: build up
build:
	@$(COMMAND) build --no-cache
up: build
	@$(COMMAND) up -d --no-build
down:
	@$(COMMAND) down
start:
	@$(COMMAND) start
stop:
	@$(COMMAND) stop
ps:
	@$(COMMAND) ps
rm:
	@$(COMMAND) rm
re: fclean all
clean: stop rm
fclean: confirm
	@$(COMMAND) down --volumes
	@images=$$(docker image ls -q "$(PROJECT_NAME)-*"); \
	if [ -n "$$images" ]; then \
		docker image rm $$images -f; \
	fi

db-migrations:

ifeq ($(PROFILE),dev)
	@$(COMMAND) run db-migrations-dev
else
	@$(COMMAND) run db-migrations
endif

confirm:
	@printf "\033[1;33m"  # Yellow color for the warning message
	@printf "WARNING: This action will permanently remove images and associated volumes. Are you sure you want to proceed? "
	@printf "\033[0m[y/N] "  # Reset color
	@read response; \
	if [ "$$response" != "y" ]; then \
		printf "\033[0mAborted.\n"; \
		exit 1; \
	fi

.PHONY: all build up down start stop ps rm re clean fclean db-migrations confirm
# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: bsilva-c <bsilva-c@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/15 17:36:39 by bsilva-c          #+#    #+#              #
#    Updated: 2024/02/15 18:42:45 by bsilva-c         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

PROFILES = prod dev
PROFILE ?= dev

# Check if profile is a valid profile
ifeq ($(filter $(PROFILE),$(PROFILES)),)
    $(error Invalid profile specified: {$(PROFILE)} Valid profiles are {$(PROFILES)})
endif


ifeq ($(PROFILE),dev)
COMMAND = docker compose --profile dev
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
fclean:
	@$(COMMAND) down --volumes

.PHONY: all build up down start stop ps rm re clean fclean
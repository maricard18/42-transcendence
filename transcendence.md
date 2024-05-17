# ft_transcendence

### Main Goal
users play Pong with others. Must have a nice user interface and real-time multiplayer

### Warning
- All used frameworks must be authorized 
- All used services must be justified

> Mandaroty part done is 25% of the grade

> To Complete: More 7 major modules. 2 Minor modules are equal to an major

### Our Modules

|Group			|Module										|Majority|Modules	|Points |Confirmed	| 
|-------		|--------									|:-----:|:---------:|:-:    |:---------:|
| - 			|Mandatory Part					        	| -	    | -			|25     |Mandatory	|
|Web			|Use Backend framework						|Major	|1			|15     |Yes		|
|Web			|Use frontend framework						|minor	|¹/²		|5      |Yes		|
|Web			|Use database for backend					|minor	|¹/²		|5      |Yes		|
|User Management|User management, auth across tournaments	|Major	|1			|10     |Yes		|
|User Management|Implementing remote authentication			|Major	|1			|10     |Yes    	|
|Gameplay / Ux	|Remote players								|Major	|1			|10     |Yes		|
|Gameplay / Ux	|Multiplayers in the same game				|Major	|1			|10     |Yes		|
|Gameplay / Ux	|Another Game with History and Matchmaking	|Major	|1			|10     |Yes		|
|Gameplay / Ux	|Game Customization Options					|minor	| -			| -     |To Confirm	|
|AI-Algo		|Introduce an AI Opponent					|Major	|1			|10     |Yes		|
|Cybersecurity	|WAF/ModSecurity and HashiCorp Vault		|Major	|1			|10     |Yes		|
|Cybersecurity	|Two-Factor Authentication and JWT			|Major	|1			|10     |Yes		|
|Devops			|Backend as Microservices					|Major	|1			|10     |Yes		|
|Devops			|Monitoring system							|minor	|¹/²		|5      |Yes		|
|**Total**		|											|		|**11.5**	|**145**|			|

## Requirements

### Minimal technical requirements
- [ ] `Major Module` Is the Backend using Django? 
- [ ] `Minor Module` Is the Frontend using Bootstrap toolkit?
- [ ] `Minor Module` Are All Database instances using PostgreSQL?
- [ ] `Mandatory` Is the game using a single-page application?
- [ ] `Mandatory` Is possible to use Back/buttons on browser?
- [ ] `Mandatory` Is it Compatible with the latest Chrome? 
- [ ] `Mandatory` Are All services launched with a single command?
- [ ] `Mandatory` Are runtime Docker's files located in /sgoinfre?
- [ ] `Mandatory` Not uses bind mount volumes between host and container if non-root UIDs are used in the container!

### Game
- [ ] `Mandatory` Is the game graphically similar to the original pong?
- [ ] `Mandatory` Can the users play pong with each other with the same keyboard?
- [ ] `Mandatory` Are all players playing with the same rules, speed and paddle?
- [ ] `Mandatory` Has the game a tournament system? [🡲](#tournament-system)
- [ ] `Mandatory` User cannot see unhandled error or warnings!
- [ ] `Major Module` Can the user play against a remote player on the same game?
- [ ] `Major Module` Can the user play against multiple players in the same game remotely?
- [ ] `Major Module` Can the user play another game with history and matchmaking?
- [ ] `Major Module` Is possible to customize the game options? [🡲](#game-customization-options)                                        
- [ ] `Major Module` Has an AI Opponent available to play against the user? [🡲](#ai-algo)                            

### User Management
- [ ] `Major Module` Has the App a Standart Management System? [🡲](#standart-user-management)
- [ ] `Major Module` Is possible to use a Remote Authentication? [🡲](#remote-authentication)

### Security
- [ ] `Mandatory` Uses HTTPS? 
- [ ] `Major Module` Is the WAF/ModSecurity protecting the App against attacks? [🡲](#modsecurity)
- [ ] `Mandatory` Has protection against SQL Injection/XXS?
- [ ] `Major Module` Are the sensitive App data encrypted and stored on the HashiCorp Vault? [🡲](#hashicorp-vault) 
- [ ] `Mandatory` Is the API routes protected?
- [ ] `Mandatory` Is the password stored hashed **if applicable**?
- [ ] `Mandatory` Has a Strong hashing algorithm?
- [ ] `Mandatory` Are The Credentials, API keys and environment vars on .env?
- [ ] `Major Module` Can the user enable Two-Factor Authentication? [🡲](#two-factor-authentication-and-jwt)

### DevOps
- [ ] `Major Module` Is the Backend divided into multiple services? [🡲](#backend-as-microservices)
- [ ] `Minor Module` Has a Monitoring System? [🡲](#monitoring-system)

## Tests Cases

### Tournament System
- [ ] Is possible to register in the tournament with an alias?
- [ ] Is possible to see the tournament tree?
- [ ] Is there a matchmaking system?
- [ ] Is shown who is playing against who?
- [ ] Are the aliases reseted when a new tournament starts?
      
[Top 🡱](#game)

#### Game Customization Options
- [ ] Can the user use different power-ups, attack or diferent maps?
- [ ] Is possible to play the simple pong game?
- [ ] Is the customization options available to all games?
- [ ] Is the customization options user-friendly?
      
[Top 🡱](#game)

#### AI-Algo
- [ ] Is an AI Opponent available to play against the user?
- [ ] Is the algorithm self developed? It's not permitted the use of A* Algorithm 
- [ ] Is the AI Opponent challenging to the user?
- [ ] Is the AI Opponent refreshing its view once per second?
- [ ] Is the AI Opponent using the same rules as the user?
- [ ] If power ups are used, is the AI Opponent using them too?
      
[Top 🡱](#game)

### Standart User Management
- [ ] Can the user register to the App in a secure way? 
- [ ] Can the user login to the App in a secure way?
- [ ] Can the user have a unique username to play the tournament?
- [ ] Can the user update his profile?
- [ ] Can the user delete his profile?
- [ ] Can the user a default profile avatar?
- [ ] Can the user add friends and see their profiles?
- [ ] Can the user profile display his stats and history matches?
- [ ] Is the user's email and username unique?
      
[Top 🡱](#user-management)

### Remote Authentication
- [ ] Can the user login to the App with 42 OAuth?
- [ ] is the way to login with 42 OAuth secure?
- [ ] Is any sensitive data exposed in the login process?
      
[Top 🡱](#user-management)

#### Modsecurity
- [ ] Is the WAF/ModSecurity protecting the App against attacks?
      
[Top 🡱](#security)

#### HashiCorp Vault 
- [ ] Is the Sensitives data stored in HashiCorp Vault?
- [ ] Are these data encrypted in the HashiCorp Vault?
      
[Top 🡱](#security)

#### Two-Factor Authentication and JWT
- [ ] Can the user enable Two-Factor Authentication?
- [ ] Is the 2FA service user-friendly?
- [ ] Is the JWT token used to authenticate the user in a secure way?
- [ ] Is the JWT preventing the user from accessing unauthorized routes?
      
[Top 🡱](#security)

#### Backend as Microservices
- [ ] Is the Backend divided into multiple services?
- [ ] Is it a clear boundary and interface between the development, deployment and operation of the services?
- [ ] Is the Backend services using a communication protocol such REST API to exchange data?
- [ ] Is each service responsible for a specific task?
      
[Top 🡱](#devops)

#### Monitoring system
- [ ] Is the monitoring system using Prometheus?
- [ ] Is the monitoring system using Grafana?
- [ ] Is there a data exporter configured to send data to Prometheus?
- [ ] Is there a custom dashboard in Grafana too see the metrics?
- [ ] Is there a data retention time on Prometheus?
- [ ] Is there custom alerts configured using Prometheus to send alerts when an anomaly is detected?
- [ ] Is there a security authentication to access the grafana?
  
[Top 🡱](#devops)

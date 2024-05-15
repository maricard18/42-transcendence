# ft_transcendence

## Requiriments

#### Main Goal
users play Pong with others. Must have a nice user interface and real-time multiplayer

#### Warning
- All used frameworks must be authorized 
- All used services must be justified

#### Mandatory 


##### Minimal technical requirements
- [ ] Backend with Framework module and Database module in Our Case
- [ ] FrontEnd with module in Our Case
- [ ] Use a single-page application
- [ ] User be able to use Back/buttons on browser
- [ ] Compatible with the latest Chrome 
- [ ] User cannot see unhandled error or warnings
- [ ] Launch all services with a single command
- [ ] Docker runtime files located in /sgoinfre
- [ ] Not use bind mount volumes between host and container if non-root UIDs are used in the container

##### Game
- [ ] Users play a live match against each other with same keyboard
- [ ] Registration system in tournament with alias input
- [ ] User plays a match with each other in a tournament
- [ ] Matchmaking system
- [ ] Show who is playing with whom
- [ ] Aliases reseted when new tournament starts
- [ ] Same rules, speed and paddle to all players
- [ ] Graphic similar to original pong 

##### Security
- [ ] Passwords must be stored hashed **if applicable**
- [ ] Protection agaisnt SQL Injection/XXS
- [ ] Use HTTPS
- [ ] Api routes protection
- [ ] Strong hashing algorithm
- [ ] Credentials, API keys and env vars on .env

> Until here, 25% is done

> Minimum to complete: More 7 major modules. 2 Minor modules are equal to an major

#### Our Modules

|Group			|Module										|Majority|Points	|Confirmed	| 
|-------		|--------									|:-----:|:---------:|:---------:|
|Web			|Use Backend framework						|Major	|1			|Yes		|
|Web			|Use frontend framework						|minor	|0.5		|Yes		|
|Web			|Use database for backend					|minor	|0.5		|Yes		|
|User Management|User management, auth across tournaments	|Major	|1			|Yes		|
|User Management|Implementing remote authentication			|Major	|-			|To Confirm	|
|Gameplay / Ux	|Remote players								|Major	|1			|Yes		|
|Gameplay / Ux	|Multiplayers in the same game				|Major	|1			|Yes		|
|Gameplay / Ux	|Another Game with History and Matchmaking	|Major	|1			|Yes		|
|Gameplay / Ux	|Game Customization Options					|minor	|-			|To Confirm	|
|AI-Algo		|Introduce an AI Opponent					|Major	|1			|Yes		|
|AI-Algo		|User and Game Stats Dashboards				|minor	|-			|To Confirm	|
|Cybersecurity	|WAF/ModSecurity and HashiCorp Vault		|Major	|1			|Yes		|
|Cybersecurity	|Two-Factor Authentication and JWT			|Major	|1			|Yes		|
|Devops			|Backend as Microservices					|Major	|1			|Yes		|
|Devops			|Monitoring system							|minor	|0.5		|Yes		|
|**Total**		|											|		|**10.5**	|			|

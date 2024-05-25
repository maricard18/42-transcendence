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
|AI-Algo		|Introduce an AI Opponent					|Major	|1			|10     |Yes		|
|Cybersecurity	|WAF/ModSecurity and HashiCorp Vault		|Major	|1			|10     |Yes		|
|Cybersecurity	|Two-Factor Authentication and JWT			|Major	|1			|10     |Yes		|
|Devops			|Backend as Microservices					|Major	|1			|10     |Yes		|
|Devops			|Monitoring system							|minor	|¹/²		|5      |Yes		|
|**Total**		|											|		|**11.5**	|**145**|			|

## Requirements

### Minimal technical requirements
- [ ] `Major Module` Is the Backend using **Django**?
- [ ] `Minor Module` Is the Frontend using **Bootstrap** toolkit?
- [ ] `Minor Module` Are All Database instances using **PostgreSQL**?
- [ ] `Mandatory` Is it Compatible with the latest **Chrome**? 
- [ ] `Mandatory` Is the game using a **single-page** application?
- [ ] `Mandatory` Is possible to use **Back/buttons** on browser?
- [ ] `Mandatory` Are All services launched with a **single command**?
- [ ] `Mandatory` Are **runtime Docker's** files located in /sgoinfre?
- [ ] `Mandatory` Not uses **bind mount volumes** between host and container if non-root UIDs are used in the container!

### Game
- [ ] `Mandatory` Is the game graphically similar to the original pong?
- [ ] `Mandatory` Can the users play pong with each other with the same keyboard?
- [ ] `Mandatory` Are all players playing with the same rules, speed and paddle?
- [ ] `Mandatory` Is there a a screen with a fast explanation about the game rules?
- [ ] `Mandatory` When the game is over, there is a end game screen?
- [ ] `Mandatory` Has the game a tournament system? [Go →](#tournament-system)
- [ ] `Major Module` Has an **AI Opponent** available to play against the user? [Go →](#ai-algo)                            
- [ ] `Major Module` Can the user play against a **remote player** on the same game? [Go →](#remote-multiplayer)
- [ ] `Major Module` Can the user play against **multiple players** in the same game remotely? [Go →](#remote-multiplayer)
- [ ] `Major Module` Can the user play a **second game** with history and matchmaking? [Go →](#second-game)

### User Management
- [ ] `Major Module` Has the App a **Standart Management System**? [Go →](#standart-user-management)
- [ ] `Major Module` Is possible to use a **Remote Authentication**? [Go →](#remote-authentication)

### Security
- [ ] `Mandatory` Uses HTTPS?
- [ ] `Mandatory` The backend also Use HTTPS? 
- [ ] `Mandatory` Are The Credentials, API keys and environment vars on .env?
- [ ] `Mandatory` Is the password stored hashed?
- [ ] `Major Module` Is the **WAF/ModSecurity** protecting the App against attacks? [Go →](#modsecurity)
- [ ] `Mandatory` Has protection against SQL Injection/XXS? [Go →](#modsecurity)
- [ ] `Major Module` Are the sensitive App data encrypted and stored on the **HashiCorp Vault**? [Go →](#hashicorp-vault) 
- [ ] `Mandatory` Has a Strong hashing algorithm? [Go →](#hashicorp-vault)
- [ ] `Major Module` Can the user enable **Two-Factor Authentication**? [Go →](#two-factor-authentication-and-jwt)
- [ ] `Mandatory` Is the API routes protected? [Go →](#two-factor-authentication-and-jwt)

### DevOps
- [ ] `Major Module` Is the Backend divided into multiple services? [Go →](#backend-as-microservices)
- [ ] `Minor Module` Has a Monitoring System? [Go →](#monitoring-system)

### Input Field Tests

#### Sign-up Page
- [ ] Is email field OK? [Go →](#sign-up-email)
- [ ] Are password fields OK? [Go →](#sign-up-password)
- [ ] Is username field OK? [Go →](#sign-up-username)

#### Login Page
- [ ] Is username field OK? [Go →](#login-username)
- [ ] Is password field OK? [Go →](#login-password)
- [ ] Is 2FA field OK? [Go →](#login-2fa)

#### Settings Username Email Page
- [ ] Is email field OK? [Go →](#settings-email)
- [ ] Is username field OK? [Go →](#settings-username)

#### Settings Password 2FA Page
- [ ] Are password fields OK? [Go →](#settings-password)
- [ ] Is 2FA field OK? [Go →](#settings-2fa)

#### Friends Page
- [ ] Is the search field OK? [Go →](#friends-search-field)

#### Pong Tournament Page
- [ ] Is the field 1 OK? [Go →](#pong-tournament-field-1)
- [ ] Is the field 2 OK? [Go →](#pong-tournament-field-2)
- [ ] Is the field 3 OK? [Go →](#pong-tournament-field-3)
- [ ] Is the field 4 OK? [Go →](#pong-tournament-field-4)

#### Tic Tac Toe Tournament Page
- [ ] Is the field 1 OK? [Go →](#tic-tac-toe-tournament-field-1)
- [ ] Is the field 2 OK? [Go →](#tic-tac-toe-tournament-field-2)
- [ ] Is the field 3 OK? [Go →](#tic-tac-toe-tournament-field-3)
- [ ] Is the field 4 OK? [Go →](#tic-tac-toe-tournament-field-4)

### After All
- [ ] `Mandatory` ⚠ User cannot see unhandled error or warnings ⚠!
- [ ] `Mandatory` Aren't any console.log or console.warn on the code?

## Tests Scenarios and Cases

### Tournament System
- [ ] Is possible to register in the tournament with an alias?
- [ ] Is possible to see the tournament tree?
- [ ] Is there a matchmaking system?
- [ ] Is shown who is playing against who?
- [ ] When refresh the page during wait room, its possible to see the room again?
- [ ] When refresh the page during the match, the match is restarted?
- [ ] Is the points counted correctly?
- [ ] Is the winner of each match showed correctly?
- [ ] Is the winner of the tournament showed correctly?
- [ ] Are the aliases reseted when a new tournament starts?

[Top ↑](#game)

### AI-Algo
- [ ] Is an AI Opponent available to play against the user?
- [ ] Is the algorithm self developed? ⚠ It's not permitted the use of **A* Algorithm**
- [ ] Is the AI Opponent challenging to the user?
- [ ] Is the AI Opponent refreshing its view once per second?
- [ ] Is the AI Opponent using the same rules as the user?
- [ ] If power ups are used, is the AI Opponent using them too?
- [ ] When the user refresh the page during the match, the AI Opponent is still there?
- [ ] When press Enter, `Esc`, `Space` or `any key`, the game still running?
      
[Top ↑](#game)

### Remote Multiplayer
- [ ] When click on Multiplayer game, the user can see the available players?
- [ ] When refresh the page during the room wait, the room is still there?
- [ ] When the player select the 2-mode players, if the second player is not ready, still waiting?
- [ ] And if the second player is ready, the match is started?
- [ ] When the player select the 4-mode players, if the other players are not ready, still waiting?
- [ ] And if the other players are ready, the match is started?
- [ ] In this mode, When a player leaves the room, the room is still there?
- [ ] Are the other players notified when a player leaves the room?
- [ ] Are the players that stayed in the room correctly?
- [ ] During the match, if a player leaves, the match is stopped?
- [ ] When the player refresh the page during the match, the match is restarted?
- [ ] All pontuations are correct during the match?
- [ ] All names are correct during the match?
- [ ] All avatars are correct during the match?
- [ ] Is all running in real-time and the game is smooth?
- [ ] When the match is over, the winner is showed correctly?
      
[Top ↑](#game)

### Second Game
- [ ] Is there a second game available?
- [ ] Is the second game different from the first one?
- [ ] Is the second game user-friendly?
- [ ] Is the second game available to all users?
- [ ] Is possible to see the history of the matches?
- [ ] Is possible to play against a remote player?
- [ ] All friends are visible in the second game?

[Top ↑](#game)

### Standart User Management
- [ ] Can the user have a unique username to play the tournament?
- [ ] Is the username unique?
- [ ] Can the user a default profile avatar?
- [ ] Can the user update his profile?
- [ ] Can the user delete his profile?
- [ ] When the user delete his profile, the data is encrypted?
- [ ] Can the user add friends and see their profiles?
- [ ] Can the user profile display his stats and history matches?
- [ ] All showed data is correct?
- [ ] All sensitive data about the user is encrypted?
- [ ] All sensitive data about friends is encrypted?

[Top ↑](#user-management)

### Remote Authentication
- [ ] Can the user login to the App with 42 OAuth?
- [ ] is the way to login with 42 OAuth secure?
- [ ] Is any sensitive data exposed in the login process?
      
[Top ↑](#user-management)

### Modsecurity
- [ ] Is the WAF/ModSecurity protecting the App against attacks?
- [ ] Has a Forbidden error when this url? `http://localhost:8443/?=<script>alert('XSS')</script>`
- [ ] Has success message when run `nikto` tool?
      
[Top ↑](#security)

### HashiCorp Vault 
- [ ] Are the Sensitives data stored in HashiCorp Vault?
- [ ] Are these data encrypted in the HashiCorp Vault?
      
[Top ↑](#security)

### Two-Factor Authentication and JWT
- [ ] Can the user enable Two-Factor Authentication?
- [ ] Is the JWT preventing the user from accessing unauthorized routes?
- [ ] Is the JWT encrypted on requests and responses?
      
[Top ↑](#security)

### Backend as Microservices
- [ ] Is the Backend divided into multiple services?
- [ ] Is it a clear boundary and interface between the development, deployment and operation of the services?
- [ ] Is the Backend services using a communication protocol such REST API to exchange data?
- [ ] Is each service responsible for a specific task?
      
[Top ↑](#devops)

### Monitoring system
- [ ] Is the monitoring system using Prometheus?
- [ ] Is the monitoring system using Grafana?
- [ ] Is there a data exporter configured to send data to Prometheus?
- [ ] Is there a custom dashboard in Grafana too see the metrics?
- [ ] Is there a data retention time on Prometheus? Restart Prometheus service and check if the previous data remains using Grafana
- [ ] Is there custom alerts configured using Prometheus to send alerts when an anomaly is detected?
- [ ] When launch nikto tool, is there a warning message on Slack?
- [ ] When stop the modsecurity service, is there a warning message on Slack?
- [ ] When try to access the Prometheus directly is impossible? Try localhost:9090
- [ ] Is there a security authentication to access the grafana?
  
[Top ↑](#devops)

### Input Field Tests

#### Sign-up Email
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_email_address_with_many_chars@this_is_a_very_long_email_address_with_many_chars.com`
- [ ] Mixing valid chars and spaces show an error? Try something like `its the user@email.com
- [ ] Only spaces show an error?
- [ ] Using email without `@` show an error?
- [ ] Using two `@` on email show an error?
- [ ] Using email without `dot` show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#sign-up-page)

#### Sign-up Password
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_password_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `this is a password`
- [ ] Only spaces show an error?
- [ ] Are masked when typing?
- [ ] Using different passwords show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#sign-up-page)

#### Sign-up Username
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_username_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its the user`
- [ ] Only spaces show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#sign-up-page)

#### Login Username
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_username_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its the user`
- [ ] Only spaces show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#login-page)

#### Login Password
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_password_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `this is a password`
- [ ] Only spaces show an error?
- [ ] Are masked when typing?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#login-page)

#### Login 2FA
- [ ] Empty fields show an error?
- [ ] Anything different than numbers show an error? Try something like `abcohj`
- [ ] Many chars show an error? Try something like `1234567890987456321012345678909874563210`
- [ ] Mixing valid chars and spaces show an error? Try something like `123 56`
- [ ] Only spaces show an error?
- [ ] Wrong codes show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#login-page)

#### Settings Username
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_username_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its the user`
- [ ] Only spaces show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#settings-username-email-page)

#### Settings Email
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_email_address_with_many_chars@this_is_a_very_long_email_address_with_many_chars.com`
- [ ] Mixing valid chars and spaces show an error? Try something like `its the user@email.com
- [ ] Only spaces show an error?
- [ ] Using email without `@` show an error?
- [ ] Using two `@` on email show an error?
- [ ] Using email without `dot` show an error?
- [ ] Duplicate email show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#settings-username-email-page)

#### Settings Password
- [ ] Empty fields show an error?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `1000` chars
- [ ] Only spaces show an error?
- [ ] Are masked when typing?
- [ ] Using different passwords show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#settings-password-2fa-page)

#### Settings 2FA
- [ ] Empty fields show an error?
- [ ] Anything different than numbers show an error? Try something like `abcohj`
- [ ] Many chars show an error? Try something like `1234567890987456321012345678909874563210`
- [ ] Mixing valid chars and spaces show an error? Try something like `123 56`
- [ ] Only spaces show an error?
- [ ] Wrong codes show an error?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#settings-password-2fa-page)

#### Friends Search Field
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_term_with_many_chars_to_search_a_friend`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my friend`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#friends-page)

#### Pong Tournament Field 1
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#pong-tournament-page)

#### Pong Tournament Field 2
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#pong-tournament-page)

#### Pong Tournament Field 3
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#pong-tournament-page)

#### Pong Tournament Field 4
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#pong-tournament-page)

#### Tic Tac Toe Tournament Field 1
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#tic-tac-toe-tournament-page)

#### Tic Tac Toe Tournament Field 2
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#tic-tac-toe-tournament-page)

#### Tic Tac Toe Tournament Field 3
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#tic-tac-toe-tournament-page)

#### Tic Tac Toe Tournament Field 4
- [ ] Empty fields show an message?
- [ ] Only symbols show an error?
- [ ] Many chars show an error? Try something like `this_is_a_very_long_alias_with_many_chars_1234567890!@#$%^&*()_+`
- [ ] Mixing valid chars and spaces show an error? Try something like `its my alias`
- [ ] Only spaces show an message?
- [ ] SQL injection show an error? Try something like `OR '1' = '1'`
- [ ] Script injection show an error? Try something like `<script>alert('XSS')</script>`
- [ ] Is this data encrypted in request and response?

[Top ↑](#tic-tac-toe-tournament-page)

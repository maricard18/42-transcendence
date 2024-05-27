# **Transcendence**
This project was graded <strong>125/100</strong> <br>
-> [Subject](./assets/subject.pdf)

## 📒 **About**
This project is about creating a web application from scratch.  
In this app, you will be able to play the original Pong and an infinite version of tic tac toe.  
Both games allow you to play locally and online.  
You can also add other users as friends, see their online status and check their match history.  
Check all these features in our little demo below!  

## 🎥 **Demo**
<p align="center">
  <img src="./assets/demo.gif" width="100%">
</p>

## 📱 **Technologies Used**
- **Docker**: To containerize the applications.
- **Docker Compose**: To manage multi-container Docker applications and implement micro-services.
- **Django**: Backend framework.
- **Javascript**: For the frontend application.
- **PostgreSQL**: As the relational database management system.
- **Redis**: For caching and message brokering.
- **Nginx**: As a reverse proxy and load balancer.
- **HashiCorp Vault**: For sensitive information management.
- **Grafana**: For monitoring and observability.
- **Prometheus**: For metrics collection and monitoring.
- **Telegraf**: For collecting and sending metrics.
- **Alertmanager**: For handling alerts sent by Prometheus.
- **ModSecurity**: For web application firewall.
- **Nikto**: For web server vulnerability scanning.

## 🏃🏼 **How to run this project**
> [!NOTE]
> To build and run this project you need to have a `.env` file and `secrets` folder with services sensitive information.

### .env file
Follow the `.env.example` file content to fill the `.env` file correctly

### secrets folder structure
```
secrets/
├── auth_service/
│ └── postgres-host
├── game_service/
│ └── postgres-host
├── friendship_service/
│ └── postgres-host
├── grafana/
│ └── grafana-username
│ └── grafana-password
├── sso-42-client-secret
```

### Compiling
Run `make` to run the application in development mode.  
Run `make PROFILE=prod` to run the application in production mode.  
Run `make help` to list all the possible options.  

## 🫂 **Authorship**
- [Mario Henriques](https://github.com/maricard18) ([**maricard**](https://profile.intra.42.fr/users/maricard))
- [Bruno Costa](https://github.com/BrunoCostaGH) ([**bsilva-c**](https://profile.intra.42.fr/users/bsilva-c))
- [Walter Cruz](https://github.com/waltergcc) ([**wcorrea-**](https://profile.intra.42.fr/users/wcorrea-))

---
> Feel free to ask me any questions through Slack (**maricard**)  
> GitHub [@maricard18](https://github.com/maricard18) &nbsp;&middot;&nbsp;
> Linkedin [Mario Henriques](https://www.linkedin.com/in/mario18) &nbsp;&middot;&nbsp;
> [42 Porto](https://www.42porto.com/en)

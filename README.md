# **webserver**
This project was graded <strong>125/100</strong> <br>
-> [Subject](./assets/subject.pdf)

## 📝 **Authorship**

- [Mario Henriques](https://github.com/maricard18) ([**maricard**](https://profile.intra.42.fr/users/maricard))
- [Bruno Costa](https://github.com/BrunoCostaGH) ([**bsilva-c**](https://profile.intra.42.fr/users/bsilva-c))
- [Walter Cruz](https://github.com/waltergcc) ([**wcorrea-**](https://profile.intra.42.fr/users/wcorrea-))

## 🧬 **Cloning**

To successfully clone this repository, use this command

```shell
git clone https://github.com/maricard18/42-transcendence.git 
```

## 📒 **About**
This project is about creating a web application from scratch. <br>
In this app you will be able to play the original Pong and an inifite version of tic tac toe. <br>
Both games allow you to play locally and online. <br>
You can also add other users as friends, see their online status and check their match history.


## 🎥 **Demo**

<p align="center">
  <img src="./assets/demo.gif" width="100%">
</p>


## Technologies Used
The project leverages the following technologies:

- **Docker**: To containerize the applications.
- **Docker Compose**: To manage multi-container Docker applications.
- **Django**: Backend framework.
- **Vanilla Javascript**: For the frontend application.
- **PostgreSQL**: As the relational database management system.
- **Redis**: For caching and message brokering.
- **Nginx**: As a reverse proxy and load balancer.
- **Grafana**: For monitoring and observability.
- **Prometheus**: For metrics collection and monitoring.
- **Telegraf**: For collecting and sending metrics.
- **Alertmanager**: For handling alerts sent by Prometheus.
- **ModSecurity**: For web application firewall.
- **Nikto**: For web server vulnerability scanning.

### Makefile

Run the command `make help` to list all the possible options.

### Examples

1. **Building all services with the dev profile:**
    ```sh
    make
    ```

2. **Starting the `web_service` with the prod profile:**
    ```sh
    make start SERVICE=web_service PROFILE=prod
    ```

3. **Viewing logs of the `auth_service` with the dev profile:**
    ```sh
    make logs SERVICE=auth_service
    ```

4. **Cleaning up all resources:**
    ```sh
    make fclean
    ```

## 📦 **Compilation**
To compile this project you should have a `.env` file that looks like the example at the root of the repository<br>
and a folder secrets that has 
To compile this project you should run `make` with the configuration file of your choice. <br><br>
This rule will generate a `webserv` file, which is the zipped version of all the object files. <br><br>
To launch the executable you should follow this syntax...

```sh
$ ./webserv config_file/server.conf
```

Where `config_file/server.conf` is the name of a file that represents the configuration of the webserver. <br><br>
You can find example of configuration files in the `config_files` folder. <br>


## 💫 **Testing**

This project was tested using self-made tests <br>
You can find some of them in the `tests` folder. <br>

---
> Feel free to ask me any questions through Slack (**maricard**). <br>
> GitHub [@maricard18](https://github.com/maricard18) &nbsp;&middot;&nbsp;
> Linkedin [Mario Henriques](https://www.linkedin.com/in/mario18) &nbsp;&middot;&nbsp;
> [42 Porto](https://www.42porto.com/en)
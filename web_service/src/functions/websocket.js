import AbstractView from "../views/AbstractView";
import { PaddleHeight, PaddleWidth, PaddleStartX, ScreenHeight, ScreenWidth } from "../Game/Pong/variables";
import { sendNonHostMessage } from "../Game/Pong/pongGame";
import { getToken } from "./tokens";
import { Cpu, InvertedCpu } from "../Game/Pong/Player";

export var MyWebSocket = {};

export async function connectWebsocket() {
    const accessToken = await getToken();
    const host = window.location.host;
	const protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
	const lobyySize = location.pathname.substring(location.pathname.length - 1);
	const waitingRoomNode = document.getElementById("waiting-room");
    
	MyWebSocket.ws = new WebSocket(protocol + "//" + host + "/ws/games/1/queue/" + lobyySize, [
        "Authorization",
        accessToken,
    ]);

    MyWebSocket.ws.onopen = () => {
		console.log("Created websocket!")
        AbstractView.wsCreated = true;
		AbstractView.wsConnectionStarted = false;
		waitingRoomNode.dispatchEvent( new CustomEvent ("waiting-room-callback") );
    };

	MyWebSocket.ws.onerror = (error) => {
		AbstractView.wsConnectionStarted = false;
        console.error("Error while connecting to the WS:", error);
    };

    MyWebSocket.ws.onmessage = (event) => {
        //console.log("SYSTEM", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] === "system.grouping") {
                const playerList = jsonData["data"]["players"];
                AbstractView.userQueue = playerList;
				customWaitingRoomCallback();
				customPlayerQueueCallback();
            }
            if (jsonData["type"] === "user.message") {
                const playerReadyList = jsonData["data"]["state"];
				AbstractView.userReadyList = {
					...AbstractView.userReadyList,
					...playerReadyList
				}
				customWaitingRoomCallback();
				customPlayerQueueCallback();
            }
            if (jsonData["type"] === "system.message") {
                const playerList = jsonData["data"];
                if (playerList["message"] === "user.disconnected") {
                    AbstractView.userData = {};
                    const newState = { ...AbstractView.userQueue };
					for (let key in newState) {
						if (newState[key] === playerList["user_id"]) {
							delete newState[key];
							break;
						}
					}
					AbstractView.userQueue = newState;
					customWaitingRoomCallback();
					customPlayerQueueCallback();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export function multiplayerMessageHandler(MyWebSocket, game) {
	if (MyWebSocket.ws) {
        MyWebSocket.ws.onmessage = (event) => {
            //console.log("GAME", JSON.parse(event.data));

            try {
                const jsonData = JSON.parse(event.data);

                if (jsonData["type"] === "user.message") {
					const gameData = jsonData["data"]["game"];
					
					if (gameData["index"] == 2) {
						game.player2.x = (gameData["player_x"] / gameData["screen_width"]) * ScreenWidth;
						game.player2.y = (gameData["player_y"] / gameData["screen_height"]) * ScreenHeight;
					} else if (gameData["index"] == 3) {
						game.player3.x = (gameData["player_x"] / gameData["screen_width"]) * ScreenWidth;
						game.player3.y = (gameData["player_y"] / gameData["screen_height"]) * ScreenHeight;
					} else if (gameData["index"] == 4) {
						game.player4.x = (gameData["player_x"] / gameData["screen_width"]) * ScreenWidth;
						game.player4.y = (gameData["player_y"] / gameData["screen_height"]) * ScreenHeight;
					}
					
					if (gameData["id"] == game.host_id) {
						game.player1.x = (gameData["player_x"] / gameData["screen_width"]) * ScreenWidth;
						game.player1.y = (gameData["player_y"] / gameData["screen_height"]) * ScreenHeight;
						game.ball.x = (gameData["ball_x"] / gameData["screen_width"]) * ScreenWidth;
						game.ball.y = (gameData["ball_y"] / gameData["screen_height"]) * ScreenHeight;
						game.ball.speed_x = (gameData["ball_speed_x"] / gameData["screen_width"]) * ScreenWidth;
						game.ball.speed_y = (gameData["ball_speed_y"] / gameData["screen_height"]) * ScreenHeight;
						game.player1.score = gameData["player1_score"];
						game.player2.score = gameData["player2_score"];

						if (gameData["player3_score"] && gameData["player4_score"]) {
							game.player3.score = gameData["player3_score"];
							game.player4.score = gameData["player4_score"];
						}

						game.paused = gameData["paused"];
						game.over = gameData["over"];
						game.winner = gameData["winner"];

						if (game.paused) {
							updateOpponentScreen(game);
							sendNonHostMessage(game);
						}
					}
                }
                
				if (jsonData["type"] == "system.message") {
                    const data = jsonData["data"];
                    if (data["message"] === "user.disconnected") {
						AbstractView.userData.forEach((user, index) => {
							if (data["user_id"] == user.id) {
								addCpuPlayer(index, game);
							}
						});
						
						const newState = { ...AbstractView.userQueue };
						for (let key in newState) {
							if (newState[key] === data["user_id"]) {
								delete newState[key];
								break;
							}
						}
						AbstractView.userQueue = newState;
						
						if (Object.keys(AbstractView.userQueue).length < 2) {
							AbstractView.userData.forEach((user) => {
								if (user.id !== -1) {
									localStorage.setItem("game_winner", user.username);
									return ;
								}
							});
							game.over = true;
                        	closeWebsocket();
							AbstractView.userData = {}
						}
					}
                }
            } catch (error) {
                console.log(error);
            }
        };
    }
}

function updateOpponentScreen(game) {
	const player1 = document.getElementById("player1");
	const player2 = document.getElementById("player2");
	const player3 = document.getElementById("player3");
	const player4 = document.getElementById("player4");
	
	game.clear();

	if (player1) {
		player1.dispatchEvent(
			new CustomEvent("player1", {
				detail: game.player1.score,
				bubbles: true,
			})
		);
	}
	if (player2) {
		player2.dispatchEvent(
			new CustomEvent("player2", {
				detail: game.player2.score,
				bubbles: true,
			})
		);
	}
	if (player3) {
		player3.dispatchEvent(
			new CustomEvent("player3", {
				detail: game.player3.score,
				bubbles: true,
			})
		);
	}
	if (player4) {
		player4.dispatchEvent(
			new CustomEvent("player4", {
				detail: game.player4.score,
				bubbles: true,
			})
		);
	}
	
	if (game.player1.score !== 5 && game.player2.score !== 5 && game.lobbySize == 2) {
		game.player2.x = game.player2.initial_x;
		game.player2.y = game.player2.initial_y;
		game.ball.draw(game.ctx);
		game.player1.draw(game.ctx);
		game.player2.draw(game.ctx);
	} else if (game.player1.score !== 5 && game.player2.score !== 5 && game.lobbySize == 4) {
		game.player2.x = game.player2.initial_x;
		game.player2.y = game.player2.initial_y;
		game.player3.x = game.player3.initial_x;
		game.player3.y = game.player3.initial_y;
		game.player4.x = game.player4.initial_x;
		game.player4.y = game.player4.initial_y;
		game.ball.draw(game.ctx);
		game.player1.draw(game.ctx);
		game.player2.draw(game.ctx);
		game.player3.draw(game.ctx);
		game.player4.draw(game.ctx);
	}
}

export function sendMessage(ws, message) {
    if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
}

export function closeWebsocket() {
    if (MyWebSocket.ws) {
		localStorage.removeItem("game_status");
        MyWebSocket.ws.close();
        delete MyWebSocket.ws;
		AbstractView.cleanGameData();
		AbstractView.gameOver = true;
    }
}

function customWaitingRoomCallback() {
	const waitingRoomNode = document.getElementById("waiting-room");
	if (waitingRoomNode) {
		waitingRoomNode.dispatchEvent( new CustomEvent ("waiting-room-callback"))
	}
}

function customPlayerQueueCallback() {
	const playerQueueNode = document.getElementById("player-queue");
	if (playerQueueNode) {
		playerQueueNode.dispatchEvent( new CustomEvent ("player-queue-callback"));
	}
}

function addCpuPlayer(index, game) {
	const player1 = document.getElementById("player1-info");
	const player2 = document.getElementById("player2-info");
	const player3 = document.getElementById("player3-info");
	const player4 = document.getElementById("player4-info");

	switch (index) {
		case 0:
			AbstractView.userData[0].id = -1;
			AbstractView.userData[0].avatar = "/static/images/cpu.png";
			AbstractView.userData[0].username = "CPU";
			player1.querySelector("img").setAttribute("src", AbstractView.userData[0].avatar);
			player1.querySelector("h3").innerText = AbstractView.userData[0].username;
			game.player1Left = true;
			game["player1"] = new Cpu({
				x: PaddleStartX,
				y: ScreenHeight / 2 - PaddleHeight / 2,
				color: "red",
				info: { username: "CPU" }
			});
			break;
		case 1:
			AbstractView.userData[1].id = -1;
			AbstractView.userData[1].avatar = "/static/images/cpu.png";
			AbstractView.userData[1].username = "CPU";
			player2.querySelector("img").setAttribute("src", AbstractView.userData[1].avatar);
			player2.querySelector("h3").innerText = AbstractView.userData[1].username;
			game.player2Left = true;
			game["player2"] = new Cpu({
				x: ScreenWidth - PaddleStartX - PaddleWidth,
				y: ScreenHeight / 2 - PaddleHeight / 2,
				color: "blue",
				info: { username: "CPU" }
			});
			break;
		case 2:
			AbstractView.userData[2].id = -1;
			AbstractView.userData[2].avatar = "/static/images/cpu.png";
			AbstractView.userData[2].username = "CPU";
			game.player3Left = true;
			game["player3"] = new InvertedCpu({
				x: ScreenWidth / 2 - PaddleHeight / 2,
				y: PaddleStartX,
				color: "green",
				info: { username: "CPU" }
			});
			player3.querySelector("img").setAttribute("src", AbstractView.userData[2].avatar);
			player3.querySelector("h3").innerText = AbstractView.userData[2].username;
			break;
		case 3:
			AbstractView.userData[3].id = -1;
			AbstractView.userData[3].avatar = "/static/images/cpu.png";
			AbstractView.userData[3].username = "CPU";
			player4.querySelector("img").setAttribute("src", AbstractView.userData[3].avatar);
			player4.querySelector("h3").innerText = AbstractView.userData[3].username;
			game.player4Left = true;
			game["player4"] = new InvertedCpu({
				x: ScreenWidth / 2 - PaddleHeight / 2,
				y: ScreenHeight - PaddleStartX - PaddleWidth,
				color: "yellow",
				info: { username: "CPU" }
			});
			break;
	}

	AbstractView.userData.forEach((user) => {
		console.log("user:", user);
		if (user.id !== -1) {
			game.host_id = user.id;
			console.log("New host -> ", user.id);
			return ;
		}
	});
}

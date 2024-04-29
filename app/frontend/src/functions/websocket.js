import AbstractView from "../views/AbstractView";
import { ScreenHeight, ScreenWidth } from "../Game/Pong/variables";
import { sendNonHostMessage } from "../Game/pongGame";
import { getToken } from "./tokens";

export var MyWebSocket = {};

export async function connectWebsocket() {
	const lobbySize = location.pathname.substring(location.pathname.length - 1);
    const token = await getToken();
    const host = window.location.host;
	const waitingRoomNode = document.getElementById("waiting-room");

	MyWebSocket.ws = new WebSocket(
		"ws://" + host + "/ws/games/1/queue/" + lobbySize, 
		["Authorization", token]
	);

    MyWebSocket.ws.onopen = () => {
        AbstractView.wsCreated = true;
		AbstractView.wsConnectionStarted = false;
		waitingRoomNode.dispatchEvent( new CustomEvent ("waiting-room-callback"));
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
                    const playerList = jsonData["data"];
                    if (playerList["message"] === "user.disconnected") {
                        game.over = true;
                        closeWebsocket();
						AbstractView.userData = {}
						const newState = { ...AbstractView.userQueue };
						for (let key in newState) {
							if (newState[key] === playerList["user_id"]) {
								delete newState[key];
								break;
							}
						}
						AbstractView.userQueue = newState;
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
	game.drawGoals("white");

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

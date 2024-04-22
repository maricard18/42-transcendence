import AbstractView from "../views/AbstractView";
import { ScreenHeight, ScreenWidth } from "../Game/variables";
import { sendNonHostMessage } from "../Game/pongGame";
import { getToken } from "./tokens";

export var MyWebSocket = {};

export async function connectWebsocket(lobbySize) {
    const token = await getToken();
    const host = window.location.host;
	const parentNode = document.getElementById("waiting-room");

	MyWebSocket.ws = new WebSocket(
		"ws://" + host + "/ws/games/1/queue/" + lobbySize, 
		["Authorization", token]
	);

    MyWebSocket.ws.onopen = () => {
        AbstractView.wsCreated = true;
		AbstractView.wsConnectionStarted = false;
		console.log("Created websocket");
		parentNode.dispatchEvent( new CustomEvent ("waiting-room-callback"));
    };

	MyWebSocket.ws.onerror = (error) => {
		AbstractView.wsConnectionStarted = false;
        console.error("Error while connecting to the WS:", error);
    };

    MyWebSocket.ws.onmessage = (event) => {
        console.log("SYSTEM", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] === "system.grouping") {
                const playerList = jsonData["data"]["players"];
                AbstractView.userQueue = playerList;
				parentNode.dispatchEvent( new CustomEvent ("waiting-room-callback"));
            }
            if (jsonData["type"] === "user.message") {
                const playerReadyList = jsonData["data"]["state"];
				AbstractView.userReadyList = {
					...AbstractView.userReadyList,
					...playerReadyList
				}
				parentNode.dispatchEvent( new CustomEvent ("waiting-room-callback"));
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
					parentNode.dispatchEvent( new CustomEvent ("waiting-room-callback"));
                }
            }

			//console.log("userQueue:", AbstractView.userQueue);
			//console.log("userData:", AbstractView.userData);
			//console.log("userReadyList:", AbstractView.userReadyList);
        } catch (error) {
            console.log(error);
        }
    };
}

export function multiplayerMessageHandler(MyWebSocket, game, setUserQueue, setUserData, userData, userInfo) {
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
							sendNonHostMessage(game, userData, userInfo);
						}
					}
                }
                if (jsonData["type"] == "system.message") {
                    const playerList = jsonData["data"];
                    if (playerList["message"] === "user.disconnected") {
                        game.over = true;
                        closeWebsocket();
                        setUserData([]);
                        setUserQueue((prevState) => {
                            const newState = { ...prevState };
                            for (let key in newState) {
                                if (newState[key] === playerList["user_id"]) {
                                    delete newState[key];
                                    break;
                                }
                            }
                            return newState;
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
    }
}

function updateOpponentScreen(game) {
	game.clear();
	game.drawGoals("white");

	if (game.lobbySize == 2) {
		game.drawScore(game.player1, ScreenWidth / 2 - 0.08 * ScreenWidth);
		game.drawScore(game.player2, ScreenWidth / 2 + 0.08 * ScreenWidth);
	} else {
		game.drawScore(game.player1, ScreenWidth / 4);
		game.drawScore(game.player2, ScreenWidth / 2 - 0.08 * ScreenWidth);
		game.drawScore(game.player3, ScreenWidth / 2 + 0.08 * ScreenWidth);
		game.drawScore(game.player4, ScreenWidth - ScreenWidth / 4);
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
		AbstractView.wsCreated = false;
    }
}

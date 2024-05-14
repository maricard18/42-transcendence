import AbstractView from "../views/AbstractView";
import { ScreenHeight, ScreenWidth } from "../Game/Pong/variables";
import { getPlayerIndex, sendNonHostMessage, updateScore } from "../Game/Pong/pongGame";
import { getToken } from "./tokens";
import { Cpu, InvertedCpu } from "../Game/Pong/Player";
import { ScreenSize } from "../Game/TicTacToe/variables";

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

export function multiplayerTicTacToeMessageHandler(MyWebSocket, game) {
	if (MyWebSocket.ws) {
        MyWebSocket.ws.onmessage = (event) => {
            console.log("GAME", JSON.parse(event.data));

            try {
                const jsonData = JSON.parse(event.data);

                if (jsonData["type"] === "user.message") {
					const gameData = jsonData["data"]["game"];
					
					if (gameData["index"] == 2) {
						game.player2.plays = gameData["plays"];
						for (let play of game.player2.plays) {
							play[0] = play[0] / gameData["screen_size"] * ScreenSize;
							play[1] = play[1] / gameData["screen_size"] * ScreenSize;
						}
						console.log("plyer2 info:", game.player2);
						//if (game.player2.plays.length === 3) {
						//	game.player2.plays[2][2] = true;
						//}
						game.player2.draw(game.ctx, game.size);
					}
					
					if (gameData["index"] == 1) {
						game.player1.plays = gameData["plays"];
						for (let play of game.player1.plays) {
							play[0] = play[0] / gameData["screen_size"] * ScreenSize;
							play[1] = play[1] / gameData["screen_size"] * ScreenSize;
						}
						console.log("plyer1 info:", game.player1);
						//if (game.player1.plays.length === 3) {
						//	game.player1.plays[2][2] = true;
						//}
						game.player1.draw(game.ctx, game.size);
					}

					game.board = gameData["board"];
					game.player1.myTurn = gameData["player1_turn"];
					game.player2.myTurn = gameData["player2_turn"];
					game.over = gameData["over"];
					game.winner = gameData["winner"];
                }
                
				if (jsonData["type"] == "system.message") {
                    const data = jsonData["data"];
                    if (data["message"] === "user.disconnected") {
						if (Object.keys(AbstractView.userData).length) {
							AbstractView.userData.forEach((user, index) => {
								if (data["user_id"] == user.id && game.lobbySize == 2) {
									user.id = -1;
								}
								 
							});
						}

						const newState = { ...AbstractView.userQueue };
						for (let key in newState) {
							if (newState[key] === data["user_id"]) {
								delete newState[key];
								break;
							}
						}
						AbstractView.userQueue = newState;
						
						if (Object.keys(AbstractView.userQueue).length < 2) {
							console.log("UserData:", AbstractView.userData);
							for (let data of AbstractView.userData) {
								if (data.id !== -1) {
									localStorage.setItem("game_winner", data.username);
								}
							}
							game.over = true;
                        	closeWebsocket();
							AbstractView.userData = {};
						}
					}
                }
            } catch (error) {
                console.log(error);
            }
        };
    }
}

export function multiplayerPongMessageHandler(MyWebSocket, game) {
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
					
					if (gameData["index"] == 1) {
						game.player1.x = (gameData["player_x"] / gameData["screen_width"]) * ScreenWidth;
						game.player1.y = (gameData["player_y"] / gameData["screen_height"]) * ScreenHeight;
						game.ball.x = (gameData["ball_x"] / gameData["screen_width"]) * ScreenWidth;
						game.ball.y = (gameData["ball_y"] / gameData["screen_height"]) * ScreenHeight;
						game.ball.speed_x = (gameData["ball_speed_x"] / gameData["screen_width"]) * ScreenWidth;
						game.ball.speed_y = (gameData["ball_speed_y"] / gameData["screen_height"]) * ScreenHeight;
						game.player1.score = gameData["player1_score"];
						game.player2.score = gameData["player2_score"];

						if (game.lobbySize == 4) {
							game.player3.score = gameData["player3_score"];
							game.player4.score = gameData["player4_score"];
						}

						game.paused = gameData["paused"];
						game.over = gameData["over"];
						game.winner = gameData["winner"];

						if (game.paused) {
							updateScore(game);
							updateOpponentScreen(game);
							sendNonHostMessage(game, getPlayerIndex());
						}
					}
                }
                
				if (jsonData["type"] == "system.message") {
                    const data = jsonData["data"];
                    if (data["message"] === "user.disconnected") {
						if (Object.keys(AbstractView.userData).length) {
							AbstractView.userData.forEach((user, index) => {
								if (data["user_id"] == user.id && game.lobbySize == 4) {
									addCpuPlayer(index, game);
								} else if (data["user_id"] == user.id && game.lobbySize == 2) {
									user.id = -1;
								}
								 
							});
						}

						const newState = { ...AbstractView.userQueue };
						for (let key in newState) {
							if (newState[key] === data["user_id"]) {
								delete newState[key];
								break;
							}
						}
						AbstractView.userQueue = newState;
						
						if (Object.keys(AbstractView.userQueue).length < 2) {
							console.log("UserData:", AbstractView.userData);
							for (let data of AbstractView.userData) {
								if (data.id !== -1) {
									localStorage.setItem("game_winner", data.username);
								}
							}
							game.over = true;
                        	closeWebsocket();
							AbstractView.userData = {};
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
	game.clear();
	
	if (game.player1.score !== 5 && game.player2.score !== 5 && game.lobbySize == 2) {
		game.player2.x = game.player2.initial_x;
		game.player2.y = game.player2.initial_y;
		game.ball.draw(game.ctx);
		game.player1.draw(game.ctx);
		game.player2.draw(game.ctx);
	} else if (game.player1.score !== 5 && game.player2.score !== 5 && 
		game.player3.score !== 5 && game.player4.score !== 5 && game.lobbySize == 4) {
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
		console.error("CLOSING WEBSOCKET");
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
		waitingRoomNode.dispatchEvent( new CustomEvent ("waiting-room-callback") )
	}
}

function customPlayerQueueCallback() {
	const playerQueueNode = document.getElementById("player-queue");
	if (playerQueueNode) {
		playerQueueNode.dispatchEvent( new CustomEvent ("player-queue-callback") );
	}
}

function addCpuPlayer(index, game) {
	console.error(`USER ${index + 1} WAS DISCONNECTED`);
	const player1 = document.getElementById("player1-info");
	const player2 = document.getElementById("player2-info");
	const player3 = document.getElementById("player3-info");
	const player4 = document.getElementById("player4-info");

	switch (index) {
		case 0:
			localStorage.setItem("player1", "CPU");
			AbstractView.userData[0].id = -1;
			AbstractView.userData[0].avatar = "/static/images/cpu.png";
			AbstractView.userData[0].username = "CPU";
			const img1 = player1.querySelector("img");
			if (img1) {
				img1.setAttribute("src", AbstractView.userData[0].avatar);
			}
			player1.querySelector("h3").innerText = AbstractView.userData[0].username;
			const oldPlayer1 = game.player1;
			const newPlayer1 = new Cpu({
				x: game.player1.x,
				y: game.player1.y,
				color: "red",
				info: AbstractView.userData[0]
			});
			game.player1 = newPlayer1;
			game.player1.score = oldPlayer1.score;
			game.player1Left = true;
			break;
		case 1:
			localStorage.setItem("player2", "CPU");
			AbstractView.userData[1].id = -1;
			AbstractView.userData[1].avatar = "/static/images/cpu_intel_corei3.png";
			AbstractView.userData[1].username = "CPU";
			const img2 = player2.querySelector("img");
			if (img2) {
				img2.setAttribute("src", AbstractView.userData[1].avatar);
			}
			player2.querySelector("h3").innerText = AbstractView.userData[1].username;
			const oldPlayer2 = game.player2;
			const newPlayer2 = new Cpu({
				x: game.player2.x,
				y: game.player2.y,
				color: "blue",
				info: AbstractView.userData[1]
			});
			game.player2 = newPlayer2;
			game.player2.score = oldPlayer2.score;
			game.player2Left = true;
			break;
		case 2:
			localStorage.setItem("player3", "CPU");
			AbstractView.userData[2].id = -1;
			AbstractView.userData[2].avatar = "/static/images/cpu_intel_corei5.png";
			AbstractView.userData[2].username = "CPU";
			const img3 = player3.querySelector("img");
			if (img3) {
				img3.setAttribute("src", AbstractView.userData[2].avatar);
			}
			player3.querySelector("h3").innerText = AbstractView.userData[2].username;
			const oldPlayer3 = game.player3;
			const newPlayer3 = new InvertedCpu({
				x: game.player3.x,
				y: game.player3.y,
				color: "green",
				info: AbstractView.userData[2]
			});
			game.player3 = newPlayer3;
			game.player3.score = oldPlayer3.score;
			game.player3Left = true;
			break;
		case 3:
			localStorage.setItem("player4", "CPU");
			AbstractView.userData[3].id = -1;
			AbstractView.userData[3].avatar = "/static/images/cpu_intel_xeon.png";
			AbstractView.userData[3].username = "CPU";
			const img4 = player4.querySelector("img");
			if (img4) {
				img4.setAttribute("src", AbstractView.userData[3].avatar);
			}
			player4.querySelector("h3").innerText = AbstractView.userData[3].username;
			const oldPlayer4 = game.player4;
			const newPlayer4 = new InvertedCpu({
				x: game.player4.x,
				y: game.player4.y,
				color: "yellow",
				info: AbstractView.userData[3]
			});
			game.player4 = newPlayer4;
			game.player4.score = oldPlayer4.score;
			game.player4Left = true;
			break;
	}

	for (let user of AbstractView.userData) {
		if (user.id !== -1) {
			game.host_id = user.id;
			console.log("New Host -> ", user.id);
			return ;
		}
	}
}

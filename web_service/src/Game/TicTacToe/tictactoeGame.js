import AbstractView from "../../views/AbstractView";
import { createSinglePlayerGameObjects, createMultiPlayer2GameObjects, createTournamentGameObjects } from "./createPlayers";
import { MyWebSocket, sendMessage } from "../../functions/websocket";
import { multiplayerMessageHandler } from "../../functions/websocket";
import { gameConfettiAnimation, gameStartAnimation } from "./animations";
import { updateVariables } from "./variables";
import { ScreenSize } from "./variables";

export function createTicTacToeGameObject(canvas, gameMode, lobbySize) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);
    updateVariables(canvas);

    if (gameMode === "single-player") {
        return createSinglePlayerGameObjects(canvas, lobbySize);
    } else if ( gameMode === "multiplayer" && lobbySize == 2) {
        return createMultiPlayer2GameObjects(canvas, lobbySize);
    } else {
		return createTournamentGameObjects(canvas);
	}
}

export async function startTicTacToe(game) {
	localStorage.removeItem("game_winner");
	if (game.mode === "single-player") {
		//await gameStartAnimation(game);
		game.last_time = Date.now();
		await singleplayerGameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else if (game.mode === "multiplayer" && game.lobbySize == 2) {
		multiplayerMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer2GameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else {
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await singleplayerGameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	}
}

function singleplayerGameLoop(game) {
    console.log("Inside Tic Tac Toe");
	game.player1.myTurn = true;
    
	return new Promise((resolve) => {
        const clickHandler = (event) => {
			game.clear();
			game.drawBoard();
			game.hit(event.offsetX, event.offsetY);
			
            //if (game.player1.myTurn) {
			//	console.log("Player1");
			//	console.log("x:", event.offsetX);
			//	console.log("y:", event.offsetY);
            //}
            //if (game.player2.myTurn) {
            //    console.log("Player2");
            //    console.log("x:", event.offsetX);
            //    console.log("y:", event.offsetY);
            //}
            
            if (game.over) {
                game.canvas.removeEventListener("click", clickHandler);
                resolve();
            }
        };
        
		game.canvas.addEventListener("click", clickHandler);
		game.clear();
		game.drawBoard();
    });
}

function multiplayer2GameLoop(game) {
	return new Promise((resolve) => {
        const playTicTacToe = () => {
            if (game.over || !MyWebSocket.ws || !localStorage.getItem("game_status")) {
				if (!game.winner) {
					game.winner = localStorage.getItem("game_winner");
				}
				game.over = true;
				updateScore(game);
				resolve();
			} else if (!game.paused && !game.over) {
				let current_time = Date.now();
				game.dt = (current_time - game.last_time) / 1000;
		
				game.clear();
		
				if (AbstractView.userInfo.id === game.host_id) {
					game.ball.update(game);
					game.player1.update(game);
					sendHostMessage(game);
				} else {
					game.player2.update(game);
					sendNonHostMessage(game, 2);
				}

				updateScore(game);
						
				if (game.player1.info.id === game.host_id) {
					//checkPlayer1Collision(game);
					//checkPlayer2Collision(game);
				}
		
				if (AbstractView.userInfo.id === game.host_id && 
				   (game.player1.score === 5 || game.player2.score === 5)) {
					const players = [game.player1, game.player2];
					game.winner = getPlayerWithMostGoals(players).info.username;
					game.over = true;
					sendHostMessage(game);
					resolve();
				}
				
				game.ball.draw(game.ctx);
				game.player1.draw(game.ctx);
				game.player2.draw(game.ctx);
			}
		
			game.last_time = Date.now();

            if (!game.over) {
                window.requestAnimationFrame(playTicTacToe);
            }
        };

		updateScore(game);
        window.requestAnimationFrame(playTicTacToe);
    });
}

export function clearBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ScreenSize, ScreenSize);
}

export function sendHostMessage(game) {
    let baseMessage = {
        game: {
            index: 1,
            screen_width: ScreenSize,
            screen_height: ScreenSize,
            player_x: game.player1.x,
            player_y: game.player1.y,
            ball_x: game.ball.x,
            ball_y: game.ball.y,
            ball_speed_x: game.ball.speed_x,
            ball_speed_y: game.ball.speed_y,
            player1_score: game.player1.score,
            player2_score: game.player2.score,
            paused: game.paused,
            over: game.over,
            winner: game.winner,
        }
    }

    if (game.lobbySize != 2) {
        baseMessage.game.player3_score = game.player3.score;
        baseMessage.game.player4_score = game.player4.score;
    }

    sendMessage(MyWebSocket.ws, baseMessage);
}

export function sendNonHostMessage(game, index) {
	if (!Object.keys(AbstractView.userData).length) {
		return;
	}

	let player = game[`player${index}`];

    const message = {
        game: {
			index: index,
            screen_width: ScreenSize,
            screen_height: ScreenSize,
            player_x: player.x,
            player_y: player.y,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

export function getPlayerIndex() {
	if (!Object.keys(AbstractView.userData).length) {
		return;
	}

	return AbstractView.userData.findIndex(element => element.id === AbstractView.userInfo.id) + 1;
}

export function updateScore(game) {
	const player1 = document.getElementById("player1");
	const player2 = document.getElementById("player2");
	const player3 = document.getElementById("player3");
	const player4 = document.getElementById("player4");

	if (player1) {
		player1.innerHTML = game.player1.score;
	}
	if (player2) {
		player2.innerHTML = game.player2.score;
	}
	if (player3) {
		player3.innerHTML = game.player3.score;
	}
	if (player4) {
		player4.innerHTML = game.player4.score;
	}
}

function getPlayerWithMostGoals(players) {
    let highestScoringPlayer = players[0];

    for (let i = 1; i < players.length; i++) {
        if (players[i].score > highestScoringPlayer.score) {
            highestScoringPlayer = players[i];
        }
    }

    return highestScoringPlayer;
}

function findTournamentWinner(game, players) {
	let match1 = JSON.parse(localStorage.getItem("match1"));
	let match2 = JSON.parse(localStorage.getItem("match2"));
	let match3 = JSON.parse(localStorage.getItem("match3"));
	let tournament = JSON.parse(localStorage.getItem("tournament"));

	for (let i = 0; i < players.length; i++) {
		if (players[i].info["username"] === game.winner) {
			if (match1 && match1["status"] !== "finished") {
				match1["winner"] = i === 0 ? match1["player1"]["index"] : match1["player2"]["index"];
				match1["status"] = "finished";
				localStorage.setItem("match1", JSON.stringify(match1));
			} else if (match2 && match2["status"] !== "finished") {
				match2["winner"] = i === 0 ? match2["player1"]["index"] : match2["player2"]["index"];
				match2["status"] = "finished";
				localStorage.setItem("match2", JSON.stringify(match2));
			} else if (match3 && match3["status"] !== "finished") {
				match3["winner"] = i === 0 ? match3["player1"]["index"] : match3["player2"]["index"];
				match3["status"] = "finished";
				tournament[4][0] = "finished";
				localStorage.setItem("match3", JSON.stringify(match3));
				localStorage.setItem("tournament", JSON.stringify(tournament));
			}
		}
	}
}
		
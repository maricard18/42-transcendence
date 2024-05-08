import AbstractView from "../../views/AbstractView";
import { checkPlayer1Collision, checkPlayer2Collision, checkInvertedPlayer3Collision, checkInvertedPlayer4Collision } from "./collision";
import { createSinglePlayerGameObjects, createMultiPlayer2GameObjects, createMultiPlayer4GameObjects, createTournamentGameObjects } from "./createPlayers";
import { MyWebSocket, sendMessage } from "../../functions/websocket";
import { multiplayerMessageHandler } from "../../functions/websocket";
import { gameConfettiAnimation, gameStartAnimation } from "../animations";
import { updateVariables } from "./variables";
import { ScreenWidth, ScreenHeight, keys } from "./variables";

export function createPongGameObject(canvas, gameMode, lobbySize) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);
    updateVariables(canvas);

    window.addEventListener("keydown", (event) => {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = false;
        }
    });

    if (gameMode === "single-player") {
        return createSinglePlayerGameObjects(ctx, lobbySize);
    } else if ( gameMode === "multiplayer" && lobbySize == 2) {
        return createMultiPlayer2GameObjects(ctx, lobbySize);
    } else if ( gameMode === "multiplayer" && lobbySize == 4) {
        return createMultiPlayer4GameObjects(ctx, lobbySize);
    } else {
		return createTournamentGameObjects(ctx);
	}
}

export async function startPong(game) {
	localStorage.removeItem("game_winner");
	if (game.mode === "single-player") {
		await gameStartAnimation(game);
		game.last_time = Date.now();
		console.log("started game");
		await singleplayerGameLoop(game);
		console.log("game finished");
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else if (game.mode === "multiplayer" && game.lobbySize == 2) {
		multiplayerMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer2GameLoop(game);
		await gameConfettiAnimation(game);
		localStorage.removeItem("game_status");
	} else if (game.mode === "multiplayer" && game.lobbySize == 4) {
		multiplayerMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer4GameLoop(game);
		console.log("Game is now over");
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
	const player1 = document.getElementById("player1");
	const player2 = document.getElementById("player2");
    
	return new Promise((resolve) => {
        const playPong = () => {
			if (!localStorage.getItem("game_status")) {
				game.over = true;
				resolve();	
			} else if (!game.paused && !game.over) {
                let current_time = Date.now();
                game.dt = (current_time - game.last_time) / 1000;

                game.clear();
                game.ball.update(game);
				game.player1.update(game);
                game.player2.update(game);

				updateScore(game);
                checkPlayer1Collision(game);
                checkPlayer2Collision(game);

                if (game.player1.score === 5 || game.player2.score === 5) {
					const players = [game.player1, game.player2]
					game.winner = getPlayerWithMostGoals(players).info.username;
                    game.over = true;

					if (game.mode === "tournament") {
						findTournamentWinner(game, players);
					}

                    resolve();
                }

                game.ball.draw(game.ctx);
                game.player1.draw(game.ctx);
                game.player2.draw(game.ctx);
            }

            game.last_time = Date.now();

            if (!game.over) {
				console.log("Here");
                window.requestAnimationFrame(playPong);
            }
        };

        window.requestAnimationFrame(playPong);
    });
}

function multiplayer2GameLoop(game) {
	return new Promise((resolve) => {
        const playPong = () => {
            if (game.over || !MyWebSocket.ws || !localStorage.getItem("game_status")) {
				if (!game.winner) {
					game.winner = localStorage.getItem("game_winner");
				}
				game.over = true;
				updateScore(game);
				console.error("GAME IS OVER");
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
					sendNonHostMessage(game, getPlayerIndex());
				}
				
				updateScore(game);
		
				if (game.player1.info.id === game.host_id) {
					checkPlayer1Collision(game);
					checkPlayer2Collision(game);
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
                window.requestAnimationFrame(playPong);
            }
        };

        window.requestAnimationFrame(playPong);
    });
}

function multiplayer4GameLoop(game) {
	return new Promise((resolve) => {
        const playPong = () => {
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
				}
				if ((game.player1Left && AbstractView.userInfo.id === game.host_id) ||
					AbstractView.userInfo.id === AbstractView.userData[0].id) {
					game.player1.update(game);
					sendHostMessage(game);
				}
				if ((game.player2Left && AbstractView.userInfo.id === game.host_id) ||
					AbstractView.userInfo.id === AbstractView.userData[1].id) {
					game.player2.update(game);
					sendNonHostMessage(game, 2);
				}
				if ((game.player3Left && AbstractView.userInfo.id === game.host_id) ||
					AbstractView.userInfo.id === AbstractView.userData[2].id) {
					game.player3.update(game);
					sendNonHostMessage(game, 3);
				}
				if ((game.player4Left && AbstractView.userInfo.id === game.host_id) ||
					AbstractView.userInfo.id === AbstractView.userData[3].id) {
					game.player4.update(game);
					sendNonHostMessage(game, 4);
				}

				updateScore(game);
		
				if (AbstractView.userInfo.id === game.host_id) {
					checkPlayer1Collision(game);
					checkPlayer2Collision(game);
					checkInvertedPlayer3Collision(game);
					checkInvertedPlayer4Collision(game);
				}
		
				if (AbstractView.userInfo.id === game.host_id &&
				   (game.player1.score === 5 || game.player2.score === 5 ||
					game.player3.score === 5 || game.player4.score === 5)) {
					const players = [game.player1, game.player2, game.player3, game.player4];
					game.winner = getPlayerWithMostGoals(players).info.username;
					game.over = true;
					sendHostMessage(game);
					resolve();
				}
		
				game.ball.draw(game.ctx);
				game.player1.draw(game.ctx);
				game.player2.draw(game.ctx);
				game.player3.draw(game.ctx);
				game.player4.draw(game.ctx);
			}

			console.log("game is paused");
		
			game.last_time = Date.now();

            if (!game.over) {
                window.requestAnimationFrame(playPong);
            }
        };

        window.requestAnimationFrame(playPong);
    });
}

export function clearBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

export function sendHostMessage(game) {
    let baseMessage = {
        game: {
            index: 1,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
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

	let player = game["player" + index];

    const message = {
        game: {
			index: index,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
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
				
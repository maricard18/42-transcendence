import AbstractView from "../views/AbstractView";
import { checkPlayer1Collision, checkPlayer2Collision, checkInvertedPlayer1Collision, checkInvertedPlayer2Collision } from "./collision";
import { createSinglePlayerGameObjects, createMultiPlayer2GameObjects, createMultiPlayer4GameObjects } from "./createPlayers";
import { MyWebSocket, sendMessage } from "../functions/websocket";
import { multiplayerMessageHandler } from "../functions/websocket";
import { gameConfettiAnimation, gameStartAnimation } from "./animations";
import { updateVariables } from "./variables";
import { ScreenWidth, ScreenHeight, keys } from "./variables";

export function createGameObject(canvas, gameMode, lobbySize) {
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
    }
}

export async function startGame(game) {
	if (game.mode === "single-player") {
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await singleplayerGameLoop(game);
		await gameConfettiAnimation(game);
		AbstractView.gameOver = true;
	} else if (game.mode === "multiplayer" && game.lobbySize == 2) {
		multiplayerMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer2GameLoop(game);
		await gameConfettiAnimation(game);
        AbstractView.gameOver = true;
	} else if (game.mode === "multiplayer" && game.lobbySize == 4) {
		multiplayerMessageHandler(MyWebSocket, game);
		await gameStartAnimation(game);
		game.last_time = Date.now();
		await multiplayer4GameLoop(game);
		await gameConfettiAnimation(game);
		AbstractView.gameOver = true;
	}
}

function singleplayerGameLoop(game) {
    return new Promise((resolve) => {
        const playPong = () => {
            if (!game.paused) {
                let current_time = Date.now();
                let dt = (current_time - game.last_time) / 1000;

                game.clear();
                game.drawGoals("white");

                game.ball.update(game, dt);
				game.player1.update(dt);
                if (game.lobbySize == 1) {
                    game.player2.update(game.ball, dt);
                } else if (game.lobbySize == 2) {
                    game.player2.update(dt);
                }

                checkPlayer1Collision(game.ball, game.player1);
                checkPlayer2Collision(game.ball, game.player2);

                game.drawScore(game.player1, ScreenWidth / 2 - 100);
                game.drawScore(game.player2, ScreenWidth / 2 + 100);

                if (game.player1.score === 5 || game.player2.score === 5) {
                    game.winner =
                        game.player1.score > game.player2.score
                            ? game.player1.info.username
                            : game.lobbySize == 1
                            ? "Computer"
                            : "Player 2";
                    game.over = true;
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

function multiplayer2GameLoop(game) {
	return new Promise((resolve) => {
        const playPong = () => {
            if (game.over || !MyWebSocket.ws) {
				resolve();
			} else if (!game.paused) {
				let current_time = Date.now();
				let dt = (current_time - game.last_time) / 1000;
		
				game.clear();
				game.drawGoals("white")
		
				if (AbstractView.userInfo.id === game.host_id) {
					game.ball.update(game, dt);
					game.player1.update(dt);
				} else {
					game.player2.update(dt);
				}
		
				if (AbstractView.userInfo.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
				}
		
				if (game.player1.info.id === game.host_id) {
					checkPlayer1Collision(game.ball, game.player1);
					checkPlayer2Collision(game.ball, game.player2);
				}
		
				game.drawScore(game.player1, ScreenWidth / 2 - 0.08 * ScreenWidth);
				game.drawScore(game.player2, ScreenWidth / 2 + 0.08 * ScreenWidth);
				
				if (AbstractView.userInfo.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
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
            if (game.over || !MyWebSocket.ws) {
				resolve();
			} else if (!game.paused) {
				let current_time = Date.now();
				let dt = (current_time - game.last_time) / 1000;
		
				clearBackground(game.ctx);
				game.drawGoals("white")
		
				if (AbstractView.userInfo.id === game.host_id) {
					game.ball.update(game, dt);
					game.player1.update(dt);
				} else if (AbstractView.userInfo.id === AbstractView.userData[1].id) {
					game.player2.update(dt);
				} else if (AbstractView.userInfo.id === AbstractView.userData[2].id) {
					game.player3.update(dt);
				} else if (AbstractView.userInfo.id === AbstractView.userData[3].id) {
					game.player4.update(dt);
				}
		
				if (AbstractView.userInfo.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
				}
		
				if (AbstractView.userInfo.id === game.host_id) {
					checkPlayer1Collision(game.ball, game.player1);
					checkPlayer2Collision(game.ball, game.player2);
					checkInvertedPlayer1Collision(game.ball, game.player3);
					checkInvertedPlayer2Collision(game.ball, game.player4);
				}
		
				game.drawScore(game.player1, ScreenWidth / 4);
				game.drawScore(game.player2, ScreenWidth / 2 - 0.08 * ScreenWidth);
				game.drawScore(game.player3, ScreenWidth / 2 + 0.08 * ScreenWidth);
				game.drawScore(game.player4, ScreenWidth - ScreenWidth / 4);
		
				if (AbstractView.userInfo.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
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

function getPlayerWithMostGoals(players) {
    let highestScoringPlayer = players[0];

    for (let i = 1; i < players.length; i++) {
        if (players[i].score > highestScoringPlayer.score) {
            highestScoringPlayer = players[i];
        }
    }

    return highestScoringPlayer;
}

export function sendHostMessage(game) {
	let message;
		
	if (game.lobbySize == 2) {
		message = {
			game: {
				id: game.player1.info.id,
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
	} else {
		message = {
			game: {
				id: game.player1.info.id,
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
				player3_score: game.player3.score,
				player4_score: game.player4.score,
				paused: game.paused,
				over: game.over,
				winner: game.winner,
			},
	}
	};

    sendMessage(MyWebSocket.ws, message);
}

export function sendNonHostMessage(game) {
	if (!Object.keys(AbstractView.userData).length) {
		return;
	}

	let playerIndex = AbstractView.userData.findIndex(
		element => element.id === AbstractView.userInfo.id) + 1;
	let player = game["player" + playerIndex];

    const message = {
        game: {
            id: player.info.id,
			index: playerIndex,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
            player_x: player.x,
            player_y: player.y,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

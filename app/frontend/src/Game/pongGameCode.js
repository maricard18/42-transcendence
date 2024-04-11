import { checkPlayer1Collision, checkPlayer2Collision } from "./collision";
import { Game } from "./Game";
import { Ball } from "./Ball";
import { Player } from "./Player1";
import { Cpu, Opponent } from "./Player2";
import { MyWebSocket, sendMessage } from "../functions/websocket";
import { multiplayerMessageHandler } from "../functions/websocket";
import { gameConfettiAnimation, gameStartAnimation } from "./animations";
import { GoalWidth, PaddleStartX, updateVariables } from "./variables";
import { ScreenWidth, ScreenHeight, keys, PaddleHeight, PaddleWidth } from "./variables";

export function createGameObject(canvas, gameMode, lobbySize, userInfo, userData) {
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
        return createSinglePlayerGame(ctx, userInfo, lobbySize);
    } else if (gameMode === "multiplayer") {
        return createMultiPlayerGame(ctx, userData, userInfo, lobbySize);
    }
}

export async function startGame(game, setUserQueue, setUserData, setGameOver) {
    switch (game.mode) {
        case "single-player":
            await gameStartAnimation(game);
            game.last_time = Date.now();
            await singleplayerGameLoop(game);
            await gameConfettiAnimation(game);
            setGameOver(true);
            break;
        case "multiplayer":
            multiplayerMessageHandler(MyWebSocket, game, setUserQueue, setUserData);
            await gameStartAnimation(game);
            game.last_time = Date.now();
            await multiplayerGameLoop(game);
            await gameConfettiAnimation(game);
            setGameOver(true);
            break;
    }
}

function createSinglePlayerGame(ctx, userInfo, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player({
                  x: PaddleStartX,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  info: userInfo,
              })
            : new Player({
                  x: PaddleStartX,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "w",
                  keyDown: "s",
                  info: userInfo,
              });

    const player2 =
        lobbySize == 1
            ? new Cpu({
                  x: ScreenWidth - PaddleStartX - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
              })
            : new Player({
                  x: ScreenWidth - PaddleStartX - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  info: 0,
              });

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
        }),
        player1: player1,
        player2: player2,
        mode: "single-player",
        host_id: null,
        lobbySize: lobbySize,
    });
}

function createMultiPlayerGame(ctx, userData, userInfo, lobbySize) {
    const host_id = userData[0].id;
    let player1, player2;

    if (host_id === userInfo.id) {
        player1 = new Player({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userInfo,
        });
        player2 = new Opponent({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: 0,
        });
    } else {
        player1 = new Player({
            x: ScreenWidth - PaddleStartX - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: userInfo,
        });
        player2 = new Opponent({
            x: PaddleStartX,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            info: 0,
        });
    }

    return new Game({
        ctx: ctx,
        ball: new Ball({
            x: ScreenWidth / 2,
            y: ScreenHeight / 2,
            color: "white",
        }),
        player1: player1,
        player2: player2,
        mode: "multiplayer",
        host_id: host_id,
        lobbySize: lobbySize,
    });
}

function singleplayerGameLoop(game) {
    return new Promise((resolve) => {
        const playPong = () => {
            if (!game.paused) {
                let current_time = Date.now();
                let dt = (current_time - game.last_time) / 1000;

                clearBackground(game.ctx);
                game.drawGoal(0, GoalWidth, "white");
                game.drawGoal(ScreenWidth - GoalWidth, ScreenWidth, "white");

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

function multiplayerGameLoop(game) {
	return new Promise((resolve) => {
        const playPong = () => {
            if (game.over || !MyWebSocket.ws) {
				resolve();
			} else if (!game.paused) {
				let current_time = Date.now();
				let dt = (current_time - game.last_time) / 1000;
		
				clearBackground(game.ctx);
				game.drawGoal(0, GoalWidth, "white");
				game.drawGoal(ScreenWidth - GoalWidth, ScreenWidth, "white");
		
				game.ball.update(game, dt);
				game.player1.update(dt);
		
				if (game.player1.info.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
				}
		
				if (game.player1.info.id === game.host_id) {
					checkPlayer1Collision(game.ball, game.player1);
					checkPlayer2Collision(game.ball, game.player2);
				}
		
				if (game.player1.info.id === game.host_id) {
					game.drawScore(game.player1, ScreenWidth / 2 - 0.08 * ScreenWidth);
					game.drawScore(game.player2, ScreenWidth / 2 + 0.08 * ScreenWidth);
				} else {
					game.drawScore(game.player2, ScreenWidth / 2 - 0.08 * ScreenWidth);
					game.drawScore(game.player1, ScreenWidth / 2 + 0.08 * ScreenWidth);
				}
		
				if (game.player1.info.id === game.host_id) {
					sendHostMessage(game);
				} else {
					sendNonHostMessage(game);
				}
		
				if (game.player1.info.id === game.host_id &&
				   (game.player1.score === 5 || game.player2.score === 5)) {
					game.winner =
						game.player1.score > game.player2.score
							? game.player1.info.username
							: game.player2.info.username
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

export function clearBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

export function sendHostMessage(game) {
    const message = {
        game: {
            id: game.player1.info.id,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
            player1_x: game.player1.x,
            player1_y: game.player1.y,
            ball_x: game.ball.x,
            ball_y: game.ball.y,
            ball_speed_x: game.ball.speed_x,
            ball_speed_y: game.ball.speed_y,
            player1_score: game.player1.score,
            player2_score: game.player2.score,
            paused: game.paused,
            over: game.over,
			winner: game.winner,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

export function sendNonHostMessage(game) {
    const message = {
        game: {
            id: game.player1.info.id,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
            player1_x: game.player1.x,
            player1_y: game.player1.y,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

import { checkPlayer1Collision, checkPlayer2Collision } from "./collision";
import { Game } from "./Game";
import { Ball } from "./Ball";
import { Player } from "./Player1";
import { Cpu, Opponent } from "./Player2";
import { MyWebSocket, sendMessage } from "../functions/websocket";
import { multiplayerMessageHandler } from "../functions/websocket";
import { startGameAnimation } from "./animations";
import { updateVariables } from "./variables";
import {
    ScreenWidth,
    ScreenHeight,
    keys,
    PaddleHeight,
    PaddleWidth,
} from "./variables";

export async function startGame(
    canvas,
    gameMode,
    lobbySize,
    userInfo,
    userQueue,
    userData,
    gameOver,
    setGameOver
) {
    const ctx = canvas.getContext("2d");
    var game;

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

    switch (gameMode) {
        case "single-player":
            game = createSinglePlayerGame(ctx, userInfo, lobbySize);
            await startGameAnimation(ctx, game);
            game.last_time = Date.now();
            singleplayerGameLoop(game, setGameOver);
            break;
        case "multiplayer":
            game = createMultiPlayerGame(ctx, userData, userInfo, lobbySize);
            multiplayerMessageHandler(MyWebSocket, game, setGameOver);
            await startGameAnimation(ctx, game);
            game.last_time = Date.now();
            multiplayerGameLoop(game, userQueue, gameOver, setGameOver);
            break;
    }
}

function createSinglePlayerGame(ctx, userInfo, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player({
                  x: 0.05 * ScreenWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  id: userInfo.id,
              })
            : new Player({
                  x: 0.05 * ScreenWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "red",
                  keyUp: "w",
                  keyDown: "s",
                  id: userInfo.id,
              });

    const player2 =
        lobbySize == 1
            ? new Cpu({
                  x: ScreenWidth - 0.05 * ScreenWidth - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
              })
            : new Player({
                  x: ScreenWidth - 0.05 * ScreenWidth - PaddleWidth,
                  y: ScreenHeight / 2 - PaddleHeight / 2,
                  color: "blue",
                  keyUp: "ArrowUp",
                  keyDown: "ArrowDown",
                  id: 0,
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
            x: 0.05 * ScreenWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            id: userInfo.id,
        });
        player2 = new Opponent({
            x: ScreenWidth - 0.05 * ScreenWidth - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            id: 0,
        });
    } else {
        player1 = new Player({
            x: ScreenWidth - 0.05 * ScreenWidth - PaddleWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "blue",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            id: userInfo.id,
        });
        player2 = new Opponent({
            x: 0.05 * ScreenWidth,
            y: ScreenHeight / 2 - PaddleHeight / 2,
            color: "red",
            keyUp: "ArrowUp",
            keyDown: "ArrowDown",
            id: 0,
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

function singleplayerGameLoop(game, setGameOver) {
    if (!game.paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(game.ctx);
        drawGoal(game.ctx, 0, 0.04 * ScreenWidth, "white");
        drawGoal(
            game.ctx,
            ScreenWidth - 0.04 * ScreenWidth,
            ScreenWidth,
            "white"
        );

        console.log("Inside the game", game);
        game.ball.update(game, dt);
        game.player1.update(dt);

        if (game.lobbySize == 1) {
            game.player2.update(game.ball, dt);
        } else if (game.lobbySize == 2) {
            game.player2.update(dt);
        }

        checkPlayer1Collision(game.ball, game.player1);
        checkPlayer2Collision(game.ball, game.player2);

        drawScore(game.ctx, game.player1, ScreenWidth / 2 - 100);
        drawScore(game.ctx, game.player2, ScreenWidth / 2 + 100);

        if (game.player1.score === 5 || game.player2.score === 5) {
            console.log("Game Finished");
            setGameOver(true);
            return;
        }

        game.ball.draw(game.ctx);
        game.player1.draw(game.ctx);
        game.player2.draw(game.ctx);
    }

    game.last_time = Date.now();

    window.requestAnimationFrame(() => singleplayerGameLoop(game, setGameOver));
}

function multiplayerGameLoop(game, userQueue, gameOver, setGameOver) {
    if (gameOver) {
        return;
    } else if (Object.values(userQueue).length != game.lobbySize) {
        setGameOver(true);
        return;
    } else if (!game.paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(game.ctx);
        drawGoal(game.ctx, 0, 0.04 * ScreenWidth, "white");
        drawGoal(
            game.ctx,
            ScreenWidth - 0.04 * ScreenWidth,
            ScreenWidth,
            "white"
        );

        game.ball.update(game, dt);
        game.player1.update(dt);

        if (game.player1.id === game.host_id) {
            sendHostMessage(game);
        } else {
            sendNonHostMessage(game);
        }

        if (game.player1.id === game.host_id) {
            checkPlayer1Collision(game.ball, game.player1);
            checkPlayer2Collision(game.ball, game.player2);
        }

        if (game.player1.id === game.host_id) {
            drawScore(
                game.ctx,
                game.player1,
                ScreenWidth / 2 - 0.08 * ScreenWidth
            );
            drawScore(
                game.ctx,
                game.player2,
                ScreenWidth / 2 + 0.08 * ScreenWidth
            );
        } else {
            drawScore(
                game.ctx,
                game.player2,
                ScreenWidth / 2 - 0.08 * ScreenWidth
            );
            drawScore(
                game.ctx,
                game.player1,
                ScreenWidth / 2 + 0.08 * ScreenWidth
            );
        }

        if (game.player1.id === game.host_id) {
            sendHostMessage(game);
        } else {
            sendNonHostMessage(game);
        }

        if (
            (game.player1.id === game.host_id &&
                (game.player1.score === 5 || game.player2.score === 5)) ||
            Object.values(userQueue).length != game.lobbySize
        ) {
            console.log("Game Finished");
            setGameOver(true);
            return;
        }

        game.ball.draw(game.ctx);
        game.player1.draw(game.ctx);
        game.player2.draw(game.ctx);
    }

    game.last_time = Date.now();

    window.requestAnimationFrame(() =>
        multiplayerGameLoop(game, userQueue, gameOver, setGameOver)
    );
}

export function clearBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

export function drawGoal(ctx, xi, xf, color) {
    ctx.beginPath();
    ctx.rect(xi, 0, xf, ScreenHeight);
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawScore(ctx, player, x) {
    ctx.font = `${0.05 * ScreenWidth}px Arial`;
    ctx.fillStyle = "white";
    ctx.fillAlign = "center";
    ctx.fillText(player.score, x, 0.08 * ScreenHeight);
}

export function sendHostMessage(game) {
    const message = {
        game: {
            id: game.player1.id,
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
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

export function sendNonHostMessage(game) {
    const message = {
        game: {
            id: game.player1.id,
            screen_width: ScreenWidth,
            screen_height: ScreenHeight,
            player1_x: game.player1.x,
            player1_y: game.player1.y,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

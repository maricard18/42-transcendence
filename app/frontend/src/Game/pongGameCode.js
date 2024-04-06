import { checkPlayer1Collision, checkPlayer2Collision } from "./collision";
import { Game } from "./Game";
import { Ball } from "./Ball";
import { Player } from "./Player1";
import { Cpu, Opponent } from "./Player2";
import { MyWebSocket, sendMessage } from "../functions/websocket";
import { multiplayerMessageHandler } from "../functions/websocket";
import {
    ScreenWidth,
    ScreenHeight,
    BackgroundColor,
    keys,
    PaddleHeight,
    PaddleWidth,
} from "./variables";
import { startGameAnimation } from "./animations";

export async function startGame(
    canvas,
    gameMode,
    lobbySize,
    userInfo,
    userQueue,
    gameOver,
    setGameOver
) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);

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

    const last_time = Date.now();
    var game;

    switch (gameMode) {
        case "single-player":
            game = createSinglePlayerGame(ctx, last_time, lobbySize);
            await startGameAnimation(ctx, last_time);
            singleplayerGameLoop(game, setGameOver);
            break;
        case "multiplayer":
            game = createMultiPlayerGame(ctx, last_time, userQueue, userInfo);
            multiplayerMessageHandler(MyWebSocket, game, setGameOver);
            await startGameAnimation(ctx, last_time);
            multiplayerGameLoop(game, gameOver, setGameOver);
            break;
    }
}

function createSinglePlayerGame(ctx, last_time, lobbySize) {
    const player1 =
        lobbySize == 1
            ? new Player(
                  25,
                  ScreenHeight / 2 - PaddleHeight / 2,
                  "red",
                  "ArrowUp",
                  "ArrowDown",
                  1
              )
            : new Player(
                  25,
                  ScreenHeight / 2 - PaddleHeight / 2,
                  "red",
                  "w",
                  "s",
                  1
              );

    const player2 =
        lobbySize == 1
            ? new Cpu(
                  ScreenWidth - 25 - PaddleWidth,
                  ScreenHeight / 2 - PaddleHeight / 2,
                  "blue"
              )
            : new Player(
                  ScreenWidth - 25 - PaddleWidth,
                  ScreenHeight / 2 - PaddleHeight / 2,
                  "blue",
                  "ArrowUp",
                  "ArrowDown",
                  2
              );

    return new Game(
        ctx,
        last_time,
        new Ball(ScreenWidth / 2, ScreenHeight / 2, "white"),
        player1,
        player2,
        "single-player",
        null,
        lobbySize
    );
}

function createMultiPlayerGame(ctx, last_time, userQueue, userInfo) {
    const host_id = Object.values(userQueue)[0];
    let player1, player2;

    if (host_id === userInfo.id) {
        player1 = new Player(
            25,
            ScreenHeight / 2 - PaddleHeight / 2,
            "red",
            "ArrowUp",
            "ArrowDown",
            userInfo.id
        );
        player2 = new Opponent(
            ScreenWidth - 25 - PaddleWidth,
            ScreenHeight / 2 - PaddleHeight / 2,
            "blue",
            "ArrowUp",
            "ArrowDown",
            0
        );
    } else {
        player1 = new Player(
            ScreenWidth - 25 - PaddleWidth,
            ScreenHeight / 2 - PaddleHeight / 2,
            "blue",
            "ArrowUp",
            "ArrowDown",
            userInfo.id
        );
        player2 = new Opponent(
            25,
            ScreenHeight / 2 - PaddleHeight / 2,
            "red",
            "ArrowUp",
            "ArrowDown",
            0
        );
    }

    return new Game(
        ctx,
        last_time,
        new Ball(ScreenWidth / 2, ScreenHeight / 2, "white"),
        player1,
        player2,
        "multiplayer",
        host_id,
		null
    );
}

function singleplayerGameLoop(game, setGameOver) {
    if (!game.paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(game.ctx);
        drawGoal(game.ctx, 0, 20, "white");
        drawGoal(game.ctx, ScreenWidth - 20, ScreenWidth, "white");

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

function multiplayerGameLoop(game, gameOver, setGameOver) {
    if (gameOver) {
        return;
    } else if (!game.paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(game.ctx);
        drawGoal(game.ctx, 0, 20, "white");
        drawGoal(game.ctx, ScreenWidth - 20, ScreenWidth, "white");

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
            drawScore(game.ctx, game.player1, ScreenWidth / 2 - 100);
            drawScore(game.ctx, game.player2, ScreenWidth / 2 + 100);
        } else {
            drawScore(game.ctx, game.player2, ScreenWidth / 2 - 100);
            drawScore(game.ctx, game.player1, ScreenWidth / 2 + 100);
        }

        if (game.player1.id === game.host_id) {
            sendHostMessage(game);
        } else {
            sendNonHostMessage(game);
        }

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

    window.requestAnimationFrame(() =>
        multiplayerGameLoop(game, gameOver, setGameOver)
    );
}

export function clearBackground(ctx) {
    ctx.fillStyle = BackgroundColor;
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

export function drawGoal(ctx, xi, xf, color) {
    ctx.beginPath();
    ctx.rect(xi, 0, xf, ScreenHeight);
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawScore(ctx, player, x) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillAlign = "center";
    ctx.fillText(player.score, x, 50);
}

export function sendHostMessage(game) {
    const message = {
        game: {
            id: game.player1.id,
            player_x: game.player1.x,
            player_y: game.player1.y,
            ball_x: game.ball.x,
            ball_y: game.ball.y,
            ball_speed_x: game.ball.speed_x,
            ball_speed_y: game.ball.speed_y,
            player_score: game.player1.score,
            opponent_score: game.player2.score,
            paused: game.paused,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

export function sendNonHostMessage(game) {
    const message = {
        game: {
            id: game.player1.id,
            player_x: game.player1.x,
            player_y: game.player1.y,
        },
    };

    sendMessage(MyWebSocket.ws, message);
}

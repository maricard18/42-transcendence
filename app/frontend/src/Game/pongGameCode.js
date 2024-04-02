import { checkPlayerCollision, checkCpuCollision } from "./collision";
import { Ball } from "./Ball";
import { Player } from "./Player";
import { Opponent } from "./Opponent";
import { Cpu } from "./Cpu";
import {
    ScreenWidth,
    ScreenHeight,
    BackgroundColor,
    keys,
    PlayerHeight,
    PlayerWidth,
    paused,
} from "./variables";
import { ws } from "../functions/websocket";
import { sendMessage } from "../functions/websocket";

export async function startGame(
    canvas,
    gameMode,
    lobbySize,
    userInfo,
    userQueue
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
    const ball = new Ball(ScreenWidth / 2, ScreenHeight / 2, "white");

    if (gameMode === "single-player" && lobbySize == 1) {
        const player = new Player(
            25,
            ScreenHeight / 2 - PlayerHeight / 2,
            "red",
            "ArrowUp",
            "ArrowDown",
            1
        );
        const cpu = new Cpu(
            ScreenWidth - 25 - PlayerWidth,
            ScreenHeight / 2 - PlayerHeight / 2,
            "blue"
        );
        const game = {
            last_time,
            ball,
            player,
            cpu,
            gameMode,
            lobbySize,
        };
        singleplayerGameLoop(game, ctx, keys);
    } else if (gameMode === "single-player" && lobbySize == 2) {
        const player = new Player(
            25,
            ScreenHeight / 2 - PlayerHeight / 2,
            "red",
            "w",
            "s",
            1
        );
        const opponent = new Player(
            ScreenWidth - 25 - PlayerWidth,
            ScreenHeight / 2 - PlayerHeight / 2,
            "blue",
            "ArrowUp",
            "ArrowDown",
            2
        );
        const game = {
            last_time,
            ball,
            player,
            opponent,
            gameMode,
            lobbySize,
        };
        singleplayerGameLoop(game, ctx);
    } else if (gameMode === "multiplayer" && lobbySize == 2) {
        const host_id = Object.values(userQueue)[0];
        let player;
        let opponent;

        if (host_id == userInfo.id) {
            player = new Player(
                25,
                ScreenHeight / 2 - PlayerHeight / 2,
                "red",
                "ArrowUp",
                "ArrowDown",
                userInfo.id
            );
            opponent = new Opponent(
                ScreenWidth - 25 - PlayerWidth,
                ScreenHeight / 2 - PlayerHeight / 2,
                "blue",
                "ArrowUp",
                "ArrowDown",
                0
            );
        } else {
            player = new Player(
                ScreenWidth - 25 - PlayerWidth,
                ScreenHeight / 2 - PlayerHeight / 2,
                "blue",
                "ArrowUp",
                "ArrowDown",
                userInfo.id
            );
            opponent = new Opponent(
                25,
                ScreenHeight / 2 - PlayerHeight / 2,
                "red",
                "ArrowUp",
                "ArrowDown",
                0
            );
        }
        const game = {
            host_id,
            player_id: userInfo.id,
            last_time,
            ball,
            player,
            opponent,
            gameMode,
            lobbySize,
        };
        multiplayerMessageHandler(ws, game, host_id);
        multiplayerGameLoop(game, ctx);
    }
}

function singleplayerGameLoop(game, ctx) {
    if (!paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(ctx);
        drawGoal(ctx, 0, 20, "white");
        drawGoal(ctx, ScreenWidth - 20, ScreenWidth, "white");

        if (game.lobbySize == 1) {
            game.ball.update(dt, game.player, game.cpu);
        } else if (game.lobbySize == 2) {
            game.ball.update(dt, game.player, game.opponent);
        }
        game.player.update(dt);
        if (game.lobbySize == 1) {
            game.cpu.update(game.ball.y, game.ball.speed_x, dt);
        } else if (game.lobbySize == 2) {
            game.opponent.update(dt);
        }

        checkPlayerCollision(game.ball, game.player);
        if (game.lobbySize == 1) {
            checkCpuCollision(game.ball, game.cpu);
        } else if (game.lobbySize == 2) {
            checkCpuCollision(game.ball, game.opponent);
        }

        drawScore(ctx, game.player, ScreenWidth / 2 - 100);
        if (game.lobbySize == 1) {
            drawScore(ctx, game.cpu, ScreenWidth / 2 + 100);
        } else if (game.lobbySize == 2) {
            drawScore(ctx, game.opponent, ScreenWidth / 2 + 100);
        }

        if (game.lobbySize == 1) {
            if (game.player.score === 5 || game.cpu.score === 5) {
                console.log("Game Finished");
                return;
            }
        } else if (game.lobbySize == 2) {
            if (game.player.score === 5 || game.opponent.score === 5) {
                console.log("Game Finished");
                return;
            }
        }

        game.ball.draw(ctx);
        game.player.draw(ctx);
        if (game.lobbySize == 1) {
            game.cpu.draw(ctx);
        } else if (game.lobbySize == 2) {
            game.opponent.draw(ctx);
        }
    }

    game.last_time = Date.now();

    window.requestAnimationFrame(() => singleplayerGameLoop(game, ctx));
}

function multiplayerGameLoop(game, ctx) {
    if (!paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(ctx);
        drawGoal(ctx, 0, 20, "white");
        drawGoal(ctx, ScreenWidth - 20, ScreenWidth, "white");

        if (game.player_id === game.host_id) {
            game.ball.update(dt, game.player, game.opponent);
        }
        game.player.update(dt);

        if (game.player_id === game.host_id) {
            const message = {
                game: {
                    id: game.player.id,
                    player_x: game.player.x,
                    player_y: game.player.y,
                    ball_x: game.ball.x,
                    ball_y: game.ball.y,
                    ball_speed_x: game.ball.speed_x,
                    ball_speed_y: game.ball.speed_y,
                    player_score: game.player.score,
                    opponent_score: game.opponent.score,
                },
            };
            sendMessage(ws, message);
        } else {
            const message = {
                game: {
                    id: game.player.id,
                    player_x: game.player.x,
                    player_y: game.player.y,
                },
            };
            sendMessage(ws, message);
        }

        if (game.player_id === game.host_id) {
            checkPlayerCollision(game.ball, game.player);
            checkCpuCollision(game.ball, game.opponent);
        }

        if (game.player_id === game.host_id) {
            drawScore(ctx, game.player, ScreenWidth / 2 - 100);
            drawScore(ctx, game.opponent, ScreenWidth / 2 + 100);
        } else {
            drawScore(ctx, game.opponent, ScreenWidth / 2 - 100);
            drawScore(ctx, game.player, ScreenWidth / 2 + 100);
        }

        if (game.player.score === 5 || game.opponent.score === 5) {
            console.log("Game Finished");
            return;
        }

        game.ball.draw(ctx);
        game.player.draw(ctx);
        game.opponent.draw(ctx);
    }

    game.last_time = Date.now();

    window.requestAnimationFrame(() => multiplayerGameLoop(game, ctx));
}

function multiplayerMessageHandler(ws, game, host) {
    ws.onmessage = (event) => {
        console.log("Game msg from server: ", JSON.parse(event.data));

        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData["type"] == "user.message") {
                const gameData = jsonData["data"]["game"];
                game.opponent.x = gameData["player_x"];
                game.opponent.y = gameData["player_y"];

                if (gameData["id"] == host) {
                    game.ball.x = gameData["ball_x"];
                    game.ball.y = gameData["ball_y"];
                    game.ball.speed_x = gameData["ball_speed_x"];
                    game.ball.speed_y = gameData["ball_speed_y"];
                    game.player.score = gameData["opponent_score"];
                    game.opponent.score = gameData["player_score"];
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
}

function clearBackground(ctx) {
    ctx.fillStyle = BackgroundColor;
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

function drawGoal(ctx, xi, xf, color) {
    ctx.beginPath();
    ctx.rect(xi, 0, xf, ScreenHeight);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawScore(ctx, player, x) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillAlign = "center";
    ctx.fillText(player.score, x, 50);
}

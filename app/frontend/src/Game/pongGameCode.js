import { checkPlayerCollision, checkCpuCollision } from "./collision";
import { Ball } from "./Ball";
import { Player } from "./Player";
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
import { log } from "../functions/utils";

export async function startGame(canvas, gameMode, lobbySize) {
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
            "ArrowDown"
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
        log("single-player 1");
        gameLoop(game, ctx, keys);
    } else if (gameMode === "single-player" && lobbySize == 2) {
        const player = new Player(
            25,
            ScreenHeight / 2 - PlayerHeight / 2,
            "red",
            "w",
            "s"
        );
        const opponent = new Player(
            ScreenWidth - 25 - PlayerWidth,
            ScreenHeight / 2 - PlayerHeight / 2,
            "blue",
            "ArrowUp",
            "ArrowDown"
        );
        const game = {
            last_time,
            ball,
            player,
            opponent,
            gameMode,
            lobbySize,
        };
        gameLoop(game, ctx);
    } else {
        const player = new Player(
            25,
            ScreenHeight / 2 - PlayerHeight / 2,
            "red",
            "ArrowUp",
            "ArrowDown"
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
        gameLoop(game, ctx);
    }
}

function gameLoop(game, ctx) {
    if (!paused) {
        let current_time = Date.now();
        let dt = (current_time - game.last_time) / 1000;

        clearBackground(ctx);
        drawGoal(ctx, 0, 20, "white");
        drawGoal(ctx, ScreenWidth - 20, ScreenWidth, "white");

		if (game.gameMode === "single-player" && game.lobbySize == 1) {
			game.ball.update(dt, game.player, game.cpu);
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            game.ball.update(dt, game.player, game.opponent);
        }
        game.player.update(dt);
        if (game.gameMode === "single-player" && game.lobbySize == 1) {
            game.cpu.update(game.ball.y, game.ball.speed_x, dt);
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            game.opponent.update(dt);
        }

        drawScore(ctx, game.player, ScreenWidth / 2 - 100);
        if (game.gameMode === "single-player" && game.lobbySize == 1) {
            drawScore(ctx, game.cpu, ScreenWidth / 2 + 100);
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            drawScore(ctx, game.opponent, ScreenWidth / 2 + 100);
        }

        if (game.gameMode === "single-player" && game.lobbySize == 1) {
            if (game.player.score === 5 || game.cpu.score === 5) {
                console.log("Game Finished");
                return;
            }
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            if (game.player.score === 5 || game.opponent.score === 5) {
                console.log("Game Finished");
                return;
            }
        }

        checkPlayerCollision(game.ball, game.player);
        if (game.gameMode === "single-player" && game.lobbySize == 1) {
            checkCpuCollision(game.ball, game.cpu);
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            checkCpuCollision(game.ball, game.opponent);
        }

        game.ball.draw(ctx);
        game.player.draw(ctx);
        if (game.gameMode === "single-player" && game.lobbySize == 1) {
            game.cpu.draw(ctx);
        } else if (game.gameMode === "single-player" && game.lobbySize == 2) {
            game.opponent.draw(ctx);
        }
    }

    game.last_time = Date.now();

    window.requestAnimationFrame(() => gameLoop(game, ctx));
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

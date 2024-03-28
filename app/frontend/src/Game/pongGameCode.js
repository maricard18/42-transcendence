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
import { getToken } from "../functions/tokens";

export async function startGame(canvas, setAuthed) {
	const token = await getToken(setAuthed);
    const ws  = new WebSocket(
        "ws://localhost:8000/ws/games/1/queue/2",
        ["Authorization", token]
    );

	ws.addEventListener("message", (event) => {
		console.log("Message from server: ", event.data);
	});

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

    let last_time = Date.now();
    let ball = new Ball(ScreenWidth / 2, ScreenHeight / 2, "white");
    let player = new Player(25, ScreenHeight / 2 - PlayerHeight / 2, "red");
    let cpu = new Cpu(
        ScreenWidth - 25 - PlayerWidth,
        ScreenHeight / 2 - PlayerHeight / 2,
        "blue"
    );

    gameLoop(ball, player, cpu, ctx, keys, last_time);
}

function gameLoop(ball, player, cpu, ctx, keys, last_time) {
    if (!paused) {
        let current_time = Date.now();
        let dt = (current_time - last_time) / 1000;

        clearBackground(ctx);

        drawGoal(ctx, 0, 20, "white");
        drawGoal(ctx, ScreenWidth - 20, ScreenWidth, "white");

        ball.update(dt, player, cpu);
        player.update(keys, dt);
        cpu.update(ball.y, ball.speed_x, dt);

        drawScore(ctx, player, ScreenWidth / 2 - 100);
        drawScore(ctx, cpu, ScreenWidth / 2 + 100);

        if (player.score === 5 || cpu.score === 5) {
            console.log("Game Over");
            return;
        }

        checkPlayerCollision(ball, player);
        checkCpuCollision(ball, cpu);

        ball.draw(ctx);
        player.draw(ctx);
        cpu.draw(ctx);
    }

    last_time = Date.now();

    window.requestAnimationFrame(() =>
        gameLoop(ball, player, cpu, ctx, keys, last_time)
    );
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

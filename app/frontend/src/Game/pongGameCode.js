import { checkPlayerCollision, checkCpuCollision } from "./collision";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Cpu } from "./Cpu";
import {
    ScreenWidth,
    ScreenHeight,
    BackgroundColor,
    keys,
    PaddleHeight,
    PaddleWidth,
} from "./variables";

export function startGame(canvas) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);

    window.addEventListener("keydown", (event) => {
        if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
    });

	let last_time = Date.now();
    let ball = new Ball(ScreenWidth / 2, ScreenHeight / 2, "white");
    let paddle = new Paddle(25, ScreenHeight / 2 - PaddleHeight / 2, "red");
    let cpu = new Cpu(
        ScreenWidth - 25 - PaddleWidth,
        ScreenHeight / 2 - PaddleHeight / 2,
        "blue"
    );

    gameLoop(ball, paddle, cpu, ctx, keys, last_time);
}

function gameLoop(ball, paddle, cpu, ctx, keys, last_time) {
	let current_time = Date.now();
	let dt = (current_time - last_time) / 1000;
    
	clearBackground(ctx);

	drawGoal(ctx, 0, 20, "white");
	drawGoal(ctx, ScreenWidth - 20, ScreenWidth, "white");

    ball.update(dt);
    paddle.update(keys, dt);
    cpu.update(ball.y, ball.speed_x, dt);

    checkPlayerCollision(ball, paddle);
    checkCpuCollision(ball, cpu);

    ball.draw(ctx);
    paddle.draw(ctx);
    cpu.draw(ctx);

	last_time = Date.now();

    window.requestAnimationFrame(() => gameLoop(ball, paddle, cpu, ctx, keys, last_time));
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

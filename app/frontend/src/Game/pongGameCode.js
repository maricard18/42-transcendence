import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Cpu } from "./Cpu";
import { ScreenWidth, ScreenHeight, BackgroundColor, keys, PaddleHeight } from "./variables";
import checkCoallision from "./coallision";

function clearBackground(ctx) {
    ctx.fillStyle = BackgroundColor;
    ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
}

export function startGame(canvas) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);

    window.addEventListener("keydown", (event) => {
        if (keys.hasOwnProperty(event.key)) 
			keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        if (keys.hasOwnProperty(event.key)) 
			keys[event.key] = false;
    });

    let ball = new Ball(ScreenWidth / 2, ScreenHeight / 2, "white");
    let paddle = new Paddle(30, ScreenHeight / 2 - PaddleHeight / 2, "red");
	let cpu = new Cpu(ScreenWidth - 30, ScreenHeight / 2 - PaddleHeight / 2, "blue");

    gameLoop(ball, paddle, cpu, ctx, keys);
}

function gameLoop(ball, paddle, cpu, ctx, keys) {
    clearBackground(ctx);

    ball.update();
    paddle.update(keys);
	cpu.update(ball.y);

	checkCoallision(ball, paddle);
	checkCoallision(ball, cpu);

    ball.draw(ctx);
    paddle.draw(ctx);
	cpu.draw(ctx);

    window.requestAnimationFrame(() =>
        gameLoop(ball, paddle, cpu, ctx, keys)
    );
}

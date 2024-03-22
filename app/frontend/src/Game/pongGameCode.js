import { Ball } from "./Ball";
import { Paddle, PaddleHeight } from "./Paddle";
import { Width, Height, BackgroundColor, keys } from "./variables";

function clearBackground(ctx) {
    ctx.fillStyle = BackgroundColor;
    ctx.fillRect(0, 0, Width, Height);
}

export function startGame(canvas) {
    const ctx = canvas.getContext("2d");

    clearBackground(ctx);

    window.addEventListener("keydown", (event) => {
        if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
    });

    let ball = new Ball(Width / 2, Height / 2);
    let paddle = new Paddle(50, Height / 2 - PaddleHeight / 2);

    gameLoop(ball, paddle, ctx, keys);
}

function gameLoop(ball, paddle, ctx, keys) {
    clearBackground(ctx);

    ball.update();
    paddle.update(keys);

    ball.draw(ctx);
    paddle.draw(ctx);

    window.requestAnimationFrame(() =>
        gameLoop(ball, paddle, ctx, keys)
    );
}

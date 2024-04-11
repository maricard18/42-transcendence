import { sendHostMessage } from "./pongGameCode";

export var PaddleStartXScalar = 0.03;
export var paddleHeightScalar = 0.15;
export var paddlewidthScalar = 0.025;
export var ballRadiusScalar = 0.015;
export var ballSpeedXScalar = 0.4;
export var ballSpeedYScalar = 0.4;
export var ballTopSpeedXScalar = 1.2;
export var ballTopSpeedYScalar = 0.5;
export var GoalWidthScalar = 0.02;

export var ScreenWidth;
export var ScreenHeight;
export var PaddleStartX;
export var PaddleSpeed;
export var PaddleWidth;
export var PaddleHeight;
export var ballRadius;
export var BallSpeedX;
export var BallSpeedY;
export var BallTopSpeedX;
export var BallTopSpeedY;
export var GoalWidth;

export const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
};

export function updateVariables(canvas) {
    ScreenWidth = canvas.width;
    ScreenHeight = canvas.height;
    PaddleSpeed = canvas.height;
	PaddleStartX = PaddleStartXScalar * canvas.width;
    PaddleHeight = paddleHeightScalar * canvas.height;
    PaddleWidth = paddlewidthScalar * canvas.width;
    ballRadius = ballRadiusScalar * canvas.width;
	BallSpeedX = ballSpeedXScalar * canvas.width;
    BallSpeedY = ballSpeedYScalar * canvas.height;
	BallTopSpeedX = ballTopSpeedXScalar * canvas.width;
    BallTopSpeedY = ballTopSpeedYScalar * canvas.height;
	GoalWidth = GoalWidthScalar * canvas.width;
}

export function pauseGame(game, duration) {
    game.paused = true;
    if (game.mode === "multiplayer") {
        sendHostMessage(game);
    }

    setTimeout(() => {
        game.paused = false;
        if (game.mode === "multiplayer") {
            sendHostMessage(game);
        }
    }, duration * 1000);
}

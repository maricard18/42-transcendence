import { sendHostMessage } from "./pongGame";

export var PaddleStartXScalar = 0.015;
export var paddleHeightScalar = 0.15;
export var paddlewidthScalar = 0.025;
export var ballRadiusScalar = 0.015;
export var ballSpeedXScalar = 0.4;
export var ballSpeedYScalar = 0.4;
export var ballTopSpeedXScalar = 1.2;
export var ballTopSpeedYScalar = 0.5;

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

export const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    w: false,
    s: false,
};

export function updateVariables(canvas) {
    ScreenWidth = canvas.width;
    ScreenHeight = canvas.height;
    PaddleSpeed = canvas.height;
    PaddleStartX = PaddleStartXScalar * canvas.width;
    PaddleHeight = paddleHeightScalar * canvas.height;
    PaddleWidth = PaddleHeight * (4 / 16);
    ballRadius = ballRadiusScalar * canvas.width;
    BallSpeedX = ballSpeedXScalar * canvas.width;
    BallSpeedY = ballSpeedYScalar * canvas.height;
    BallTopSpeedX = ballTopSpeedXScalar * canvas.width;
    BallTopSpeedY = ballTopSpeedYScalar * canvas.height;
}

export function pauseGame(game, duration) {
	console.log("Game is now paused");
    game.paused = true;
    if (game.mode === "multiplayer") {
        sendHostMessage(game);
    }

    setTimeout(() => {
		console.log("game is no longer paused");
        game.paused = false;
        if (game.mode === "multiplayer") {
            sendHostMessage(game);
        }
    }, duration * 1000);
}

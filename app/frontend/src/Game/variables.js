export var BackgroundColor = "black";
export var ScreenWidth = 650;
export var ScreenHeight = 600;

export var PaddleSpeed = 500;
export var PaddleWidth = 15;
export var PaddleHeight = 80;

export var BallSpeedX = 250;
export var BallSpeedY = 250;
export var ballRadius = 10;

export var BallTopSpeedX = 900;
export var BallTopSpeedY = 300;

export const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
};

export function pauseGame(game, duration) {
    game.paused = true;
    setTimeout(() => {
        game.paused = false;
    }, duration * 1000);
}

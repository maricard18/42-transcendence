export var BackgroundColor = "black";
export var ScreenWidth = 650;
export var ScreenHeight = 600;

export var PlayerSpeed = 500;
export var PlayerWidth = 15;
export var PlayerHeight = 80;

export var BallSpeedX = 200;
export var BallSpeedY = 200;
export var ballRadius = 10;

export var paused = false;

export const keys = {
    ArrowUp: false,
    ArrowDown: false,
};

export function pauseGame(duration) {
    paused = true;
    setTimeout(() => {
        paused = false;
    }, duration * 1000);
}

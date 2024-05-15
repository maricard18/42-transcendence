import { sendHostMessage } from "./tictactoeGame";

export var ScreenMarginScalar = 0.08;
export var BoxMarginScalar = 0.03;

export var ScreenSize;
export var ScreenMargin;
export var BoxMargin;
export var Linewidth = 10;

export function updateVariables(canvas) {
    ScreenSize = canvas.width;
	ScreenMargin = ScreenSize * ScreenMarginScalar;
	BoxMargin = ScreenSize * BoxMarginScalar;
}

export function pauseGame(game, duration) {
	//console.log("Game is now paused");
    game.paused = true;
    if (game.mode === "multiplayer") {
        sendHostMessage(game);
    }

    setTimeout(() => {
		//console.log("game is no longer paused");
        game.paused = false;
        if (game.mode === "multiplayer") {
            sendHostMessage(game);
        }
    }, duration * 1000);
}

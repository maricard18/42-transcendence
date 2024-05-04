import { ScreenHeight, ScreenWidth } from "./variables";

export class Game {
    constructor({ ctx, ball, player1, player2, player3, player4, mode, host_id, lobbySize }) {
        this.ctx = ctx;
        this.last_time = Date.now();
        this.ball = ball;
        this.player1 = player1;
        this.player2 = player2;
		this.player3 = player3;
		this.player4 = player4;
        this.mode = mode;
        this.host_id = host_id;
        this.lobbySize = lobbySize;
		this.dt = null;
        this.paused = true;
        this.over = false;
		this.winner = null;
		this.lastTouch = null;
		this.player1Left = false;
		this.player2Left = false;
		this.player3Left = false;
		this.player4Left = false;
    }

	clear() {
		this.ctx.fillStyle = "black";
    	this.ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
	}

    drawScore(player, x) {
        this.ctx.font = `${0.05 * ScreenWidth}px Arial`;
        this.ctx.fillStyle = "white";
        this.ctx.fillAlign = "center";
        this.ctx.fillText(player.score, x, 0.08 * ScreenHeight);
    }
}

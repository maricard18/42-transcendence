import { GoalWidth, ScreenHeight, ScreenWidth } from "./variables";

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
        this.paused = true;
        this.over = false;
		this.winner = null;
    }

	clear() {
		this.ctx.fillStyle = "black";
    	this.ctx.fillRect(0, 0, ScreenWidth, ScreenHeight);
	}

    drawGoals(color) {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, GoalWidth, ScreenHeight);
		this.ctx.rect(ScreenWidth - GoalWidth, 0, GoalWidth, ScreenHeight);
		this.ctx.rect(0, 0, ScreenWidth, GoalWidth);
		this.ctx.rect(0, ScreenHeight - GoalWidth, ScreenWidth, GoalWidth);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    drawScore(player, x) {
        this.ctx.font = `${0.05 * ScreenWidth}px Arial`;
        this.ctx.fillStyle = "white";
        this.ctx.fillAlign = "center";
        this.ctx.fillText(player.score, x, 0.08 * ScreenHeight);
    }
}

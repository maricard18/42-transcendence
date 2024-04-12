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
        this.paused = true;
        this.over = false;
		this.winner = null;
    }

    drawGoal(xi, xf, color) {
        this.ctx.beginPath();
        this.ctx.rect(xi, 0, xf, ScreenHeight);
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

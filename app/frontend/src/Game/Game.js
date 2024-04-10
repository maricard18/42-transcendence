export class Game {
    constructor({ctx, ball, player1, player2, mode, host_id, lobbySize}) {
        this.ctx = ctx;
        this.last_time = Date.now();
        this.ball = ball;
        this.player1 = player1;
        this.player2 = player2;
        this.mode = mode;
		this.host_id = host_id;
        this.lobbySize = lobbySize;
        this.paused = true;
		this.over = false;
    }
}
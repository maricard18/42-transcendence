import AbstractView from "../../views/AbstractView";
import { sendTicTacToeMessage } from "./tictactoeGame";
import { Linewidth, ScreenMargin, ScreenSize } from "./variables";

export class Game {
    constructor({ canvas, player1, player2, mode, host_id, lobbySize }) {
        this.canvas = canvas,
    	this.ctx = this.canvas.getContext("2d"),
        this.last_time = Date.now(),
        this.player1 = player1,
        this.player2 = player2,
        this.mode = mode,
        this.host_id = host_id,
        this.lobbySize = lobbySize,
        this.paused = true,
        this.over = false,
        this.winner = null,
        this.size = ScreenSize / 3 - Linewidth / 2 - ScreenMargin,
        
		this.rowLine1 = [
            [ScreenMargin, ScreenSize / 3 + Linewidth],
            [ScreenSize - ScreenMargin, ScreenSize / 3 + Linewidth],
        ],
        this.rowLine2 = [
            [ScreenMargin, (ScreenSize / 3) * 2 - Linewidth],
            [ScreenSize - ScreenMargin, (ScreenSize / 3) * 2 - Linewidth],
        ],
		this.columnLine1 = [
            [ScreenSize / 3 + Linewidth, ScreenMargin],
            [ScreenSize / 3 + Linewidth, ScreenSize - ScreenMargin],
        ],
        this.columnLine2 = [
            [(ScreenSize / 3) * 2 - Linewidth, ScreenMargin],
            [(ScreenSize / 3) * 2 - Linewidth, ScreenSize - ScreenMargin],
        ],
        
		this.row1 = [
            [0, [ScreenMargin, ScreenMargin]],
            [0, [ScreenSize / 3 + Linewidth * 2 + Linewidth / 2, ScreenMargin]],
            [0, [(ScreenSize / 3) * 2 + Linewidth / 2, ScreenMargin]],
        ],
        this.row2 = [
            [0, [ScreenMargin, ScreenSize / 3 + Linewidth * 2 + Linewidth / 2]],
            [0, [ScreenSize / 3 + Linewidth * 2 + Linewidth / 2, ScreenSize / 3 + Linewidth * 2 + Linewidth]],
            [0, [(ScreenSize / 3) * 2 + Linewidth / 2, ScreenSize / 3 + Linewidth * 2 + Linewidth / 2]],
        ],
        this.row3 = [
            [0, [ScreenMargin, (ScreenSize / 3) * 2 + Linewidth / 2]],
            [0, [ScreenSize / 3 + Linewidth * 2 + Linewidth / 2, (ScreenSize / 3) * 2 + Linewidth / 2]],
            [0, [(ScreenSize / 3) * 2 + Linewidth / 2, (ScreenSize / 3) * 2 + Linewidth / 2]],
        ],
        
		this.board = [this.row1, this.row2, this.row3]
		this.player1.board = this.board;
		this.player2.board = this.board;
    }

    clear() {
		this.ctx.clearRect(0, 0, ScreenSize, ScreenSize);
	}

    drawBoard() {
        this.ctx.beginPath();

        // row 1
        this.ctx.moveTo(this.rowLine1[0][0], this.rowLine1[0][1]);
        this.ctx.lineTo(this.rowLine1[1][0], this.rowLine1[1][1]);

        // row 2
        this.ctx.moveTo(this.rowLine2[0][0], this.rowLine2[0][1]);
        this.ctx.lineTo(this.rowLine2[1][0], this.rowLine2[1][1]);

        // column 1
        this.ctx.moveTo(this.columnLine1[0][0], this.columnLine1[0][1]);
        this.ctx.lineTo(this.columnLine1[1][0], this.columnLine1[1][1]);

        // column 2
        this.ctx.moveTo(this.columnLine2[0][0], this.columnLine2[0][1]);
        this.ctx.lineTo(this.columnLine2[1][0], this.columnLine2[1][1]);

        this.ctx.lineWidth = Linewidth;
        this.ctx.strokeStyle = "white";

        this.ctx.stroke();
    }

	hit(x, y) {
		for (let row of this.board) {
			for (let box of row) {
				if (x > box[1][0] && y > box[1][1] && x < box[1][0] + this.size && y < box[1][1] + this.size) {
					if ((!box[0] && this.player1.myTurn && this.mode !== "multiplayer") ||
					   ((!box[0] && this.player1.myTurn && AbstractView.userInfo.id === this.host_id && this.mode === "multiplayer"))) {
						this.player1.addPlay(box[1][0], box[1][1]);
						box[0] = 1;
						this.player1.myTurn = false;
						this.player2.myTurn = true;

						if (this.player2.plays.length === 3 && this.mode !== "multiplayer") {
							this.player2.plays[2][2] = true;
						}
						if (this.player1.plays.length === 3 && this.mode !== "multiplayer") {
							this.player1.plays[2][2] = false;
						}
						if (this.player1.plays.length === 3 && this.mode === "multiplayer") {
							this.player1.plays[2][2] = true;
						}

						sendTicTacToeMessage(this, 1);
					}
					if ((!box[0] && this.player2.myTurn && this.mode !== "multiplayer") ||
					   ((!box[0] && this.player2.myTurn && AbstractView.userInfo.id !== this.host_id && this.mode === "multiplayer"))) {
						this.player2.addPlay(box[1][0], box[1][1]);
						box[0] = 2;
						this.player2.myTurn = false;
						this.player1.myTurn = true;

						if (this.player1.plays.length === 3 && this.mode !== "multiplayer") {
							this.player1.plays[2][2] = true;
						}
						if (this.player2.plays.length === 3 && this.mode !== "multiplayer") {
							this.player2.plays[2][2] = flase;
						}
						if (this.player2.plays.length === 3 && this.mode === "multiplayer") {
							this.player2.plays[2][2] = true;
						}
						
						sendTicTacToeMessage(this, 2);
					}
				}
			}
		}
		
		this.player1.draw(this.ctx, this.size);
		this.player2.draw(this.ctx, this.size);
	}

	checkWinner() {
		// rows
		for (let i = 0; i < this.board.length; i++) {
			if (this.board[i][0][0] && this.board[i][0][0] === this.board[i][1][0] && this.board[i][0][0] === this.board[i][2][0]) {
				this.player1.myTurn = false;
				this.player2.myTurn = false;
				this.over = true;
				this.winner = this.board[i][0][0];
				console.log(`Row ${i + 1} was completed by player ${this.board[i][0][0]}`)
			}
		}

		// columns
		for (let i = 0; i < this.board.length; i++) {
			if (this.board[0][i][0] && this.board[0][i][0] === this.board[1][i][0] && this.board[0][i][0] === this.board[2][i][0]) {
				this.player1.myTurn = false;
				this.player2.myTurn = false;
				this.over = true;
				this.winner = this.board[0][i][0];
				console.log(`Column ${i + 1} was completed by player ${this.board[0][i][0]}`)
			}
		}

		// diagonals
		if (this.board[0][0][0] && this.board[0][0][0] === this.board[1][1][0] && this.board[0][0][0] === this.board[2][2][0]) {
			this.player1.myTurn = false;
			this.player2.myTurn = false;
			this.over = true;
			this.winner = this.board[0][0][0];
			console.log(`Left diagonal was completed by player ${this.board[0][0][0]}`)
		}
		if (this.board[0][2][0] && this.board[0][2][0] === this.board[1][1][0] && this.board[0][2][0] === this.board[2][0][0]) {
			this.player1.myTurn = false;
			this.player2.myTurn = false;
			this.over = true;
			this.winner = this.board[0][2][0];
			console.log(`Right diagonal was completed by player ${this.board[0][2][0]}`)
		}
	}
}

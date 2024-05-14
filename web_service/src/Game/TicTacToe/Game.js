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
            [[0, 0], [ScreenMargin, ScreenMargin]],
            [[0, 0], [ScreenSize / 3 + Linewidth * 2, ScreenMargin]],
            [[0, 0], [(ScreenSize / 3) * 2 + Linewidth / 2, ScreenMargin]],
        ],
        this.row2 = [
            [[0, 0], [ScreenMargin, ScreenSize / 3 + Linewidth * 2]],
            [[0, 0], [ScreenSize / 3 + Linewidth * 2, ScreenSize / 3 + Linewidth * 2]],
            [[0, 0], [(ScreenSize / 3) * 2 + Linewidth / 2, ScreenSize / 3 + Linewidth * 2]],
        ],
        this.row3 = [
            [[0, 0], [ScreenMargin, (ScreenSize / 3) * 2 + Linewidth / 2]],
            [[0, 0], [ScreenSize / 3 + Linewidth * 2, (ScreenSize / 3) * 2 + Linewidth / 2]],
            [[0, 0], [(ScreenSize / 3) * 2 + Linewidth / 2, (ScreenSize / 3) * 2 + Linewidth / 2]],
        ],
        
		this.board = [this.row1, this.row2, this.row3]
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, ScreenSize, ScreenSize);
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
		for (let [rowIndex, row] of this.board.entries()) {
			for (let [boxIndex, box] of row.entries()) {
				if (x > box[1][0] && y > box[1][1] && x < box[1][0] + this.size && y < box[1][1] + this.size) {
					if (!box[0][0] && this.player1.myTurn) {
						console.log(`Hit in box ${boxIndex + 1} of row ${rowIndex + 1}`);
						this.player1.draw(this.ctx, box[1][0], box[1][1], this.size);
						this.player1.plays
						box[0][0] = 1;
						box[0][1] = 1;
						//this.player1.myTurn = false;
						//this.player2.myTurn = true;
					}
				}
			}
		}
	}

	checkWinner() {
		// rows
		for (let [index, row] of this.board.entries()) {
			if (row[0][0] === row[1][0] && row[0][0] === row[2][0]) {
				console.log(`Row ${index + 1} is complete by player ${row[0][1]}`);
				this.over = true;
				this.winner = row[0][0];
			}
		}

		// columns
		for (let i = 0; i < this.board[0].length; i++) {
			if (this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
				console.log(`Column ${i + 1} is complete by player ${this.board[0][i]}`);
				this.over = true;
				this.winner = this.board[0][i];
			}
		}

		// diagonals
		if (this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
			console.log(`Left diagonal is complete by player ${this.board[0][0]}`);
			this.over = true;
			this.winner = this.board[0][0];
		}
		if (this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
			console.log(`Right diagonal is complete by player ${this.board[0][2]}`);
			this.over = true;
			this.winner = this.board[0][2];
		}
	}
}

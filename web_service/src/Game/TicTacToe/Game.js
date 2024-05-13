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
        this.size = ScreenSize / 3 - ScreenMargin,
        
		this.rowLine1 = [
            [ScreenMargin, ScreenSize / 3],
            [ScreenSize - ScreenMargin, ScreenSize / 3],
        ],
        this.rowLine2 = [
            [ScreenMargin, (ScreenSize / 3) * 2],
            [ScreenSize - ScreenMargin, (ScreenSize / 3) * 2],
        ],
		this.columnLine1 = [
            [ScreenSize / 3, ScreenMargin],
            [ScreenSize / 3, ScreenSize - ScreenMargin],
        ],
        this.columnLine2 = [
            [(ScreenSize / 3) * 2, ScreenMargin],
            [(ScreenSize / 3) * 2, ScreenSize - ScreenMargin],
        ],
        
		this.row1 = [
            [0, [ScreenMargin, ScreenMargin]],
            [0, [ScreenSize / 3 + Linewidth, ScreenMargin]],
            [0, [(ScreenSize / 3) * 2 + Linewidth, ScreenMargin]],
        ],
        this.row2 = [
            [0, [ScreenMargin, ScreenSize / 3 + Linewidth]],
            [0, [ScreenSize / 3 + Linewidth, ScreenSize / 3 + Linewidth]],
            [0, [(ScreenSize / 3) * 2 + Linewidth, ScreenSize / 3 + Linewidth]],
        ],
        this.row3 = [
            [0, [ScreenMargin, (ScreenSize / 3) * 2 + Linewidth]],
            [0, [ScreenSize / 3 + Linewidth, (ScreenSize / 3) * 2 + Linewidth]],
            [
                0,
                [
                    (ScreenSize / 3) * 2 + Linewidth,
                    (ScreenSize / 3) * 2 + Linewidth,
                    this.size,
                ],
            ],
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
					console.log(`Hit in box ${boxIndex + 1} of row ${rowIndex + 1}`);
					this.player1.draw(this.ctx, box[1][0], box[1][1], this.size);
				} else {
					console.log("No hit!");
				}
			}
		}
	}
}

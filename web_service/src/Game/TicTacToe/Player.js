import { BoxMargin, Linewidth } from "./variables";

export class Player {
    constructor({symbol, info}) {
		this.symbol = symbol;
        this.info = info;
		this.myTurn = false;
		this.plays = [[0, 0], [0, 0], [0, 0]];
    }

    draw(ctx, x, y, size) {
    	if (this.symbol === "X") {
			ctx.beginPath();
			ctx.moveTo(x + BoxMargin, y + BoxMargin);
			ctx.lineTo(x + size - BoxMargin, y + size - BoxMargin);
			ctx.moveTo(x + size - BoxMargin, y + BoxMargin);
			ctx.lineTo(x + BoxMargin, y + size - BoxMargin);
			ctx.lineWidth = Linewidth * 2;
			ctx.strokeStyle = "#520dc2";
			ctx.stroke();
	   	} else {
			ctx.beginPath();
			ctx.arc(x + size / 2, y + size / 2, size / 3, 0, 2 * Math.PI);
			ctx.lineWidth = Linewidth;
			ctx.strokeStyle = "#9461e6";
			ctx.stroke();
		}
    }
}

export class Cpu extends Player {
    constructor({symbol, info}) {
        super({symbol, info});
    }

    draw(ctx) {
		// create AI algorithm
	}
}

export class Opponent extends Player {
    constructor({symbol, info}) {
        super({symbol, info});
    }
}

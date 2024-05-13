import { BoxMargin, Linewidth } from "./variables";

export class Player {
    constructor({symbol, info}) {
		this.symbol = symbol;
        this.info = info;
		this.myTurn = false;
    }

    draw(ctx, x, y, size) {
       if (this.symbol === "X") {
		ctx.beginPath();

        ctx.moveTo(x + BoxMargin, y + BoxMargin);
        ctx.lineTo(x + size - BoxMargin, y + size - BoxMargin);

        ctx.moveTo(x + size - BoxMargin, y + BoxMargin);
        ctx.lineTo(x + BoxMargin, y + size - BoxMargin);

        ctx.lineWidth = Linewidth * 2;
        ctx.strokeStyle = "purple";

        ctx.stroke();
	   } else {

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

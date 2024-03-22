import { BallSpeed } from "./variables";

let ballColor = "white";
let ballRadius = 10;

export class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		ctx.beginPath();
        ctx.arc(this.x, this.y, ballRadius, 0, 2 * Math.PI);
        ctx.fillStyle = ballColor;
        ctx.fill();
	}

	update() {
		if (this.x > 0)
        	this.x -= BallSpeed;
		else
			this.x += BallSpeed;
    }
}

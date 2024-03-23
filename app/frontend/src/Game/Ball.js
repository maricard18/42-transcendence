import { BallSpeed, BallColor, BallRadius } from "./variables";

export class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		ctx.beginPath();
        ctx.arc(this.x, this.y, BallRadius, 0, 2 * Math.PI);
        ctx.fillStyle = BallColor;
        ctx.fill();
	}

	update() {
		if (this.x > 0)
        	this.x -= BallSpeed;
		else
			this.x += BallSpeed;
    }
}

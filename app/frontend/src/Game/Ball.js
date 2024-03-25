import {
    BallSpeedX,
    BallSpeedY,
    ScreenHeight,
    ScreenWidth,
    ballRadius,
} from "./variables";

export class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = ballRadius;
        this.color = color;
        this.speed_x = BallSpeedX;
        this.speed_y = BallSpeedY;
        this.last_time = Date.now();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(dt) {
        this.x += this.speed_x * dt;
        this.y += this.speed_y * dt;
        
		if (this.x - this.radius <= 0 || this.x + this.radius >= ScreenWidth)
            this.reset();
        if (this.y - this.radius <= 0 || this.y + this.radius >= ScreenHeight)
            this.speed_y *= -1;
    }

    reset() {
        this.speed_x = BallSpeedX;
        this.speed_y = BallSpeedY;
        this.x = ScreenWidth / 2;
        this.y = ScreenHeight / 2;

		// setTimeout(() => {}, 2000);
    }
}

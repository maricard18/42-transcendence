import {
    BallSpeedX,
    BallSpeedY,
    ScreenHeight,
    ScreenWidth,
    ballRadius,
    pauseGame,
} from "./variables";

export class Ball {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = ballRadius;
        this.color = color;
        this.speed_x = BallSpeedX * getRandomDirection();
        this.speed_y = BallSpeedY * getRandomDirection();
		this.acceleration = 1.1;
        this.last_time = Date.now();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(dt, player, cpu) {
        this.x += this.speed_x * dt;
        this.y += this.speed_y * dt;

		if ((this.y - this.radius <= 0 && this.speed_y < 0)|| 
			(this.y + this.radius >= ScreenHeight && this.speed_y > 0))
			this.speed_y *= -1;
        if (this.x - this.radius <= 0 && this.speed_x < 0) {
			cpu.score += 1;
			this.reset();
		}
		if (this.x + this.radius >= ScreenWidth && this.speed_x > 0) {
			player.score += 1;
            this.reset();
		}
    }

    reset() {
        this.x = ScreenWidth / 2;
        this.y = ScreenHeight / 2;

        this.speed_y = BallSpeedY * getRandomDirection();
        this.speed_x = BallSpeedX * getRandomDirection();

        pauseGame(2);
    }
}

function getRandomDirection() {
    return Math.random() < 0.5 ? -1 : 1;
}

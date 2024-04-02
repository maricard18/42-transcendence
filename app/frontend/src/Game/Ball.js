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
        this.color = color;
        this.radius = ballRadius;
        this.speed_x = BallSpeedX;
        this.speed_y = getRandomDirection();
        this.acceleration = 1.1;
        this.last_time = Date.now();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(dt, player, opponent) {
        this.x += this.speed_x * dt;
        this.y += this.speed_y * dt;

        if (
            (this.y - this.radius <= 0 && this.speed_y < 0) ||
            (this.y + this.radius >= ScreenHeight && this.speed_y > 0)
        ) {
            this.speed_y *= -1;
        }
        if (this.x - this.radius <= 0 && this.speed_x < 0) {
            opponent.score += 1;
            this.reset(player, opponent);
        }
        if (this.x + this.radius >= ScreenWidth && this.speed_x > 0) {
            player.score += 1;
            this.reset(player, opponent);
        }
    }

    reset(player, opponent) {
        this.x = ScreenWidth / 2;
        this.y = ScreenHeight / 2;

        if (player.score > opponent.score) {
            this.speed_y = getRandomDirection();
            this.speed_x = BallSpeedX;
        } else {
            this.speed_y = getRandomDirection();
            this.speed_x = BallSpeedX * -1;
        }

        pauseGame(2);
    }
}

function getRandomDirection() {
    return Math.floor(Math.random() * 2 * BallSpeedY - BallSpeedY);
}

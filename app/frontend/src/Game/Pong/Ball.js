import {
    BallSpeedX,
    BallSpeedY,
    GoalWidth,
    ScreenHeight,
    ScreenWidth,
    ballRadius,
    pauseGame,
} from "./variables";

export class Ball {
    constructor({ x, y, color }) {
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

    update(game, dt) {
        this.x += this.speed_x * dt;
        this.y += this.speed_y * dt;

		if (game.mode === "single-player" || game.lobbySize == 2) {
			if ((this.y - this.radius <= GoalWidth && this.speed_y < 0) ||
            	(this.y + this.radius >= ScreenHeight - GoalWidth && this.speed_y > 0)) {
            	this.speed_y *= -1;
        	}

			if (this.x + this.radius >= ScreenWidth && this.speed_x > 0) {
				game.player1.score += 1;
				this.reset(game);
			} else if (this.x - this.radius <= 0 && this.speed_x < 0) {
				game.player2.score += 1;
				this.reset(game);
			}
		} else {
			if (this.x + this.radius >= ScreenWidth && this.speed_x > 0) {
				if (game.lastTouch !== null) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.x - this.radius <= 0 && this.speed_x < 0) {
				if (game.lastTouch !== null) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.y + this.radius >= ScreenHeight && this.speed_y > 0) {
				if (game.lastTouch !== null) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.y - this.radius <= 0 && this.speed_y < 0) {
				if (game.lastTouch !== null) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			}
		}
    }

    reset(game) {
		if (game.player1.score !== 5 && game.player2.score !== 5) {
			this.x = ScreenWidth / 2;
			this.y = ScreenHeight / 2;
			game.lastTouch = null;
			game.player1.x = game.player1.initial_x;
			game.player1.y = game.player1.initial_y;
			game.player2.x = game.player2.initial_x;
			game.player2.y = game.player2.initial_y;

			if (game.lobbySize == 4) {
				game.player3.x = game.player3.initial_x;
				game.player3.y = game.player3.initial_y;
				game.player4.x = game.player4.initial_x;
				game.player4.y = game.player4.initial_y;
			}
			
			if (game.player1.score > game.player2.score) {
				this.speed_y = getRandomDirection();
				this.speed_x = BallSpeedX;
			} else {
				this.speed_y = getRandomDirection();
				this.speed_x = BallSpeedX * -1;
			}
			
			pauseGame(game, 2);
		}

    }
}

function getRandomDirection() {
    return Math.floor(Math.random() * 2 * BallSpeedY - BallSpeedY);
}

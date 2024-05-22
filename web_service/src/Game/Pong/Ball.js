import {
    BallSpeedX,
    BallSpeedY,
    ScreenHeight,
    ScreenWidth,
    ballRadius,
    pauseGame,
} from "./variables";

export class Ball {
    constructor({ x, y, color, lobbySize }) {
        this.x = x;
        this.y = y;
        this.color = color;
		this.lobbySize = lobbySize
        this.radius = ballRadius;

		if (this.lobbySize != 4) {
			this.angle = Math.random() * Math.PI / 4 - Math.PI / 8;
		} else {
			this.angle = Math.random() * 2 * Math.PI;
		}

		this.speed_x = BallSpeedX * Math.cos(this.angle) * (Math.random() < 0.5 ? -1 : 1);
		this.speed_y = BallSpeedY * Math.sin(this.angle);
        
		this.acceleration = 1.1;
        this.last_time = Date.now();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(game) {
        this.x += this.speed_x * game.dt;
        this.y += this.speed_y * game.dt;

		if (game.mode === "single-player" || game.lobbySize == 2) {
			if ((this.y - this.radius <= 0 && this.speed_y < 0) ||
            	(this.y + this.radius >= ScreenHeight && this.speed_y > 0)) {
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
				if (game.lastTouch) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.x - this.radius <= 0 && this.speed_x < 0) {
				if (game.lastTouch) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.y + this.radius >= ScreenHeight && this.speed_y > 0) {
				if (game.lastTouch) {
					game[game.lastTouch].score += 1;
				}
				this.reset(game);
			} else if (this.y - this.radius <= 0 && this.speed_y < 0) {
				if (game.lastTouch) {
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
			
			if (this.lobbySize != 4) {
				this.angle = Math.random() * Math.PI / 4 - Math.PI / 8;
			} else {
				this.angle = Math.random() * 2 * Math.PI;
			}

			this.speed_x = BallSpeedX * Math.cos(this.angle) * (Math.random() < 0.5 ? -1 : 1);
			this.speed_y = BallSpeedY * Math.sin(this.angle);
						
			pauseGame(game, 2);
		}

    }
}

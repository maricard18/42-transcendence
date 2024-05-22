import {
    PaddleSpeed,
    PaddleWidth,
    PaddleHeight,
    ScreenHeight,
    keys,
	ScreenWidth,
} from "./variables";

export class Player {
    constructor({x, y, color, keyUp, keyDown, info}) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.info = info;
		this.initial_x = x;
        this.initial_y = y;
        this.width = PaddleWidth;
        this.height = PaddleHeight;
        this.inital_speed = 0.35 * PaddleSpeed;
        this.speed = this.inital_speed;
        this.max_speed = PaddleSpeed;
        this.acceleration = 1.1;
        this.score = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(game) {
        if (keys[this.keyUp] && this.y >= 0) {
            if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.y -= this.speed * game.dt;
        }

        if (keys[this.keyDown] && this.y + this.height <= ScreenHeight) {
            if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.y += this.speed * game.dt;
        }

        if (!keys[this.keyUp] && !keys[this.keyDown]) {
            this.speed = this.inital_speed;
        }
    }
}

export class Cpu extends Player {
    constructor({x, y, color, info}) {
        super({x, y, color, info});
        this.last_time = Date.now();
        this.direction = 0;
        this.speed = this.max_speed / 8;
		this.paddleMiddle = this.y + this.height / 2;
    }

    update(game) {
		let distanceToImpact, timeToReachPaddle, predictedBallY, distanceToPredictedBallY;
		this.paddleMiddle = this.y + this.height / 2;
        const current_time = Date.now();
        const elapsedTime = (current_time - this.last_time) / 1000;

		if ((this.x > ScreenWidth / 2 && game.ball.speed_x > 0) || (this.x < ScreenWidth / 2 && game.ball.speed_x < 0)) {
			if (elapsedTime > 1) {
				distanceToImpact = Math.abs(game.ball.x - this.x);
				timeToReachPaddle = distanceToImpact / Math.abs(game.ball.speed_x);
				predictedBallY = game.ball.y + game.ball.speed_y * timeToReachPaddle;
				distanceToPredictedBallY = predictedBallY - this.paddleMiddle;
                this.speed = Math.min(Math.abs(distanceToPredictedBallY) / timeToReachPaddle, this.max_speed);

				if (predictedBallY < 0) {
					predictedBallY *= -1;
				} else if (predictedBallY > ScreenHeight) {
					predictedBallY = ScreenHeight - (predictedBallY - ScreenHeight);
				}
	
				if (this.paddleMiddle > predictedBallY && this.y >= 0) {
					this.y -= this.speed * game.dt;
					this.direction = -1;
				}
				if (this.paddleMiddle < predictedBallY && this.y + this.height <= ScreenHeight) {
					this.y += this.speed * game.dt;
					this.direction = 1;
				}
	
				this.last_time = Date.now();
			} else {
				if (this.direction > 0 && this.y + this.height <= ScreenHeight) {
					this.y += this.speed * game.dt;
				} else if (this.direction < 0 && this.y >= 0) {
					this.y -= this.speed * game.dt;
				}
			}
		}
    }
}

export class Opponent extends Player {
    constructor({x, y, color, keyUp, keyDown, info}) {
        super({x, y, color, keyUp, keyDown, info});
    }
}

export class InvertedPlayer {
    constructor({x, y, color, keyRight, keyLeft, info}) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.keyRight = keyRight;
        this.keyLeft = keyLeft;
        this.info = info;
        this.initial_x = x;
        this.initial_y = y;
        this.width = PaddleHeight;
        this.height = PaddleWidth;
        this.inital_speed = 0.35 * PaddleSpeed;
        this.speed = this.inital_speed;
        this.max_speed = PaddleSpeed;
        this.acceleration = 1.1;
        this.score = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(game) {
        if (keys[this.keyLeft] && this.x >= 0) {
            if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.x -= this.speed * game.dt;
        }

        if (keys[this.keyRight] && this.x + this.width <= ScreenWidth) {
			if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.x += this.speed * game.dt;
        }

        if (!keys[this.keyRight] && !keys[this.keyLeft]) {
            this.speed = this.inital_speed;
        }
    }
}

export class InvertedCpu extends InvertedPlayer {
    constructor({x, y, color, info}) {
        super({x, y, color, info});
        this.last_time = Date.now();
        this.direction = 0;
        this.speed = this.max_speed / 8;
		this.paddleMiddle = this.x + this.width / 2;
    }

    update(game) {
		let distanceToImpact, timeToReachPaddle, predictedBallX, distanceToPredictedBallX;
		this.paddleMiddle = this.x + this.width / 2;
        const current_time = Date.now();
        const elapsedTime = (current_time - this.last_time) / 1000;

		if ((this.y > ScreenHeight / 2 && game.ball.speed_y > 0) || (this.y < ScreenHeight / 2 && game.ball.speed_y < 0)) {
			if (elapsedTime > 1) {
				distanceToImpact = Math.abs(game.ball.y - this.y);
				timeToReachPaddle = distanceToImpact / Math.abs(game.ball.speed_y);
				predictedBallX = game.ball.x + game.ball.speed_x * timeToReachPaddle;
				distanceToPredictedBallX = predictedBallX - this.paddleMiddle;
                this.speed = Math.min(Math.abs(distanceToPredictedBallX) / timeToReachPaddle, this.max_speed);

				if (predictedBallX < 0) {
					predictedBallX *= -1;
				} else if (predictedBallX > ScreenWidth) {
					predictedBallX = ScreenWidth - (predictedBallX - ScreenWidth);
				}
	
				if (this.paddleMiddle > predictedBallX && this.x >= 0) {
					this.x -= this.speed * game.dt;
					this.direction = -1;
				}
				if (this.paddleMiddle < predictedBallX && this.x + this.width <= ScreenWidth) {
					this.x += this.speed * game.dt;
					this.direction = 1;
				}
	
				this.last_time = Date.now();
			} else {
				if (this.direction > 0 && this.x + this.width <= ScreenWidth) {
					this.x += this.speed * game.dt;
				} else if (this.direction < 0 && this.x >= 0) {
					this.x -= this.speed * game.dt;
				}
			}
		}
    }
}


export class InvertedOpponent extends InvertedPlayer {
	constructor({x, y, color, keyRight, keyLeft, info}) {
		super({x, y, color, keyRight, keyLeft, info});
	}
}

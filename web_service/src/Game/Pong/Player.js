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
		this.image = new Image();
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
    }

    update(game) {
		if (this.x > ScreenWidth /  2) {
			if (game.ball.x > ScreenWidth / 2 &&
				game.ball.speed_x > 0 &&
				this.y + this.height / 2 > game.ball.y &&
				this.y >= 0) {
				this.y -= this.max_speed * game.dt;
			}
			if (game.ball.x > ScreenWidth / 2 &&
				game.ball.speed_x > 0 &&
				this.y + this.height / 2 < game.ball.y &&
				this.y + this.height <= ScreenHeight) {
				this.y += this.max_speed * game.dt;
			}
		} else {
			if (game.ball.x < ScreenWidth / 2 &&
				game.ball.speed_x < 0 &&
				this.y + this.height / 2 > game.ball.y &&
				this.y >= 0) {
				this.y -= this.max_speed * game.dt;
			}
			if (game.ball.x < ScreenWidth / 2 &&
				game.ball.speed_x < 0 &&
				this.y + this.height / 2 < game.ball.y &&
				this.y + this.height <= ScreenHeight) {
				this.y += this.max_speed * game.dt;
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
    }

    update(game) {
        if (this.y > ScreenWidth /  2) {
			if (game.ball.y > ScreenHeight / 2 &&
				game.ball.speed_y > 0 &&
				this.x + this.width / 2 > game.ball.x &&
				this.x >= 0) {
				this.x -= this.max_speed * game.dt;
			}
			if (game.ball.y > ScreenHeight / 2 &&
				game.ball.speed_y > 0 &&
				this.x + this.width / 2 < game.ball.x &&
				this.x + this.width <= ScreenWidth) {
				this.x += this.max_speed * game.dt;
			}
		} else {
			if (game.ball.y < ScreenHeight / 2 &&
				game.ball.speed_y < 0 &&
				this.x + this.width / 2 > game.ball.x &&
				this.x >= 0) {
				this.x -= this.max_speed * game.dt;
			}
			if (game.ball.y < ScreenHeight / 2 &&
				game.ball.speed_y < 0 &&
				this.x + this.width / 2 < game.ball.x &&
				this.x + this.width <= ScreenWidth) {
				this.x += this.max_speed * game.dt;
			}
		}
    }
}

export class InvertedOpponent extends InvertedPlayer {
	constructor({x, y, color, keyRight, keyLeft, info}) {
		super({x, y, color, keyRight, keyLeft, info});
	}
}

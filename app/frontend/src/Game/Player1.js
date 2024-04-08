import {
    PaddleSpeed,
    PaddleWidth,
    PaddleHeight,
    ScreenHeight,
    keys,
} from "./variables";

export class Player {
    constructor(x, y, color, keyUp, keyDown, id) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.id = id;
		this.initial_x = x;
        this.initial_y = y;
        this.width = PaddleWidth;
        this.height = PaddleHeight;
        this.inital_speed = 200;
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

    update(dt) {
        if (keys[this.keyUp] && this.y >= 0) {
            if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.y -= this.speed * dt;
        }

        if (keys[this.keyDown] && this.y + this.height <= ScreenHeight) {
            if (this.speed < this.max_speed) {
                this.speed *= this.acceleration;
            } else {
                this.speed = this.max_speed;
            }

            this.y += this.speed * dt;
        }

        if (!keys[this.keyUp] && !keys[this.keyDown]) {
            this.speed = this.inital_speed;
        }
    }
}

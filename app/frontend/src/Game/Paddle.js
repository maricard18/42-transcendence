import { PaddleSpeed, PaddleWidth, PaddleHeight, ScreenHeight } from "./variables";

export class Paddle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
		this.width = PaddleWidth;
		this.height = PaddleHeight;
		this.speed = PaddleSpeed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(keys) {
        if (keys.ArrowUp && this.y >= 0) 
			this.y -= this.speed;
        if (keys.ArrowDown && this.y + this.height <= ScreenHeight)
            this.y += this.speed;
    }
}

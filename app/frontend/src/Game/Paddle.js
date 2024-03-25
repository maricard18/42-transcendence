import { PaddleSpeed, PaddleWidth, PaddleHeight, ScreenHeight } from "./variables";

export class Paddle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
		this.width = PaddleWidth;
		this.height = PaddleHeight;
		this.inital_speed = 200;
		this.speed = this.inital_speed;
		this.max_speed = PaddleSpeed;
		this.acceleration = 1.1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(keys, dt) {
        if (keys.ArrowUp && this.y >= 0)
		{
			if (this.speed < this.max_speed)
				this.speed *= this.acceleration;
			else
				this.speed = this.max_speed;

			this.y -= this.speed * dt;
			console.log(this.speed);
		} 
		
		if (keys.ArrowDown && this.y + this.height <= ScreenHeight)
		{
			if (this.speed < this.max_speed)
				this.speed *= this.acceleration;
			else
				this.speed = this.max_speed;

			this.y += this.speed * dt;
			console.log(this.speed);
		}
		
		if (!keys.ArrowUp && !keys.ArrowDown)
			this.speed = this.inital_speed;
    }
}

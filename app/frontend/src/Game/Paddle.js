import { PaddleSpeed, PaddleWidth, PaddleHeight, PaddleColor, Height } from "./variables";

export class Paddle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw(ctx) {
		ctx.beginPath();
        ctx.rect(this.x, this.y, PaddleWidth, PaddleHeight);
      	ctx.fillStyle = PaddleColor;
      	ctx.fill();
	}

	update(keys) {
		if (keys.ArrowUp && this.y > 0)
			this.y -= PaddleSpeed;
        if (keys.ArrowDown && this.y + PaddleHeight < Height)
			this.y += PaddleSpeed;
    }
}

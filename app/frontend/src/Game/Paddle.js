import { PaddleSpeed } from "./variables";

let PaddleColor = "white";
let PaddleWidth = 10;
export let PaddleHeight = 60;

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
		if (keys.ArrowUp)
			this.y -= PaddleSpeed;
        if (keys.ArrowDown)
			this.y += PaddleSpeed;
    }
}

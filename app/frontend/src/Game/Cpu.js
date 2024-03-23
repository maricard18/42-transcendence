import { Paddle } from "./Paddle";
import { ScreenHeight, PaddleSpeed } from "./variables";

export class Cpu extends Paddle {
	constructor(x, y, color) {
		super(x, y, color);
	}

	update(y) {
		if (this.y > y && this.y >= 0)
			this.y -= this.speed;
		if (this.y < y && this.y + this.height <= ScreenHeight)
			this.y += this.speed;
    }
}

import { Paddle } from "./Paddle";
import { ScreenHeight, PaddleSpeed } from "./variables";

export class Cpu extends Paddle {
	constructor(x, y, color) {
		super(x, y, color);
	}

	update(ball_y, speed, dt) {
		if (this.y > ball_y && this.y >= 0 && speed > 0)
			this.y -= this.max_speed * dt;
		if (this.y < ball_y && this.y + this.height <= ScreenHeight && speed > 0)
			this.y += this.max_speed * dt;
    }
}

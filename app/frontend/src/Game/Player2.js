import { Player } from "./Player1";
import { ScreenHeight, ScreenWidth } from "./variables";

export class Cpu extends Player {
    constructor({x, y, color}) {
        super({x, y, color});
    }

    update(ball, dt) {
        if (
            ball.x > ScreenWidth / 2 &&
            ball.speed_x > 0 &&
            this.y + this.height / 2 > ball.y &&
            this.y >= 0
        ) {
            this.y -= this.max_speed * dt;
        }
        if (
            ball.x > ScreenWidth / 2 &&
            ball.speed_x > 0 &&
            this.y + this.height / 2 < ball.y &&
            this.y + this.height <= ScreenHeight
        ) {
            this.y += this.max_speed * dt;
        }
    }
}

export class Opponent extends Player {
	constructor({x, y, color, keyUp, keyDown, id}) {
		super({x, y, color, keyUp, keyDown, id});
	}
}

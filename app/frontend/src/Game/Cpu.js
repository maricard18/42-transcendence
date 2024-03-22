import { Paddle } from "./Paddle";
import { PaddleSpeed } from "./variables";

let PaddleColor = "white";
let PaddleWidth = 10;
export let PaddleHeight = 60;

export class Cpu extends Paddle {
	constructor(x, y) {
		super(x, y);
	}

	update(x, y) {
		if (keys.ArrowUp)
			this.y -= PaddleSpeed;
        if (keys.ArrowDown)
			this.y += PaddleSpeed;
    }
}

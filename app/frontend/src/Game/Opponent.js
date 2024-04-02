import { Player } from "./Player";

export class Opponent extends Player {
	constructor(x, y, color, keyUp, keyDown, id) {
		super(x, y, color, keyUp, keyDown, id);
	}
}

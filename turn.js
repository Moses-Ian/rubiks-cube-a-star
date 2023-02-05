let turnFrames = 20;
let turnSpeed = Math.PI/2 / turnFrames;

class Turn {
	constructor(direction = null, index = 1) {
		this.direction = direction;
		this.index = index;
		this.framesLeft = turnFrames;
	}
}

export { Turn, turnSpeed };
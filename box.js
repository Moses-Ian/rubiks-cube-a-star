class Box {
	constructor(posX, posY, posZ, len) {
		this.pos = createVector(posX, posY, posZ);
		this.len = len;
	}
	
	show() {
		fill(255);
		stroke(0);
		strokeWeight(8);
		push();
		
		translate(this.pos);
		box(this.len);
		
		pop();
	}
}
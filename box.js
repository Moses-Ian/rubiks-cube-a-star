class Box {
	constructor(posX, posY, posZ, len) {
		this.pos = createVector(posX, posY, posZ);
		this.len = len;
	}
	
	show() {
		stroke(0);
		strokeWeight(2);
		// noStroke();
		push();
		
		translate(this.pos);
		// box(this.len);
		let r = this.len / 2;
		fill(colors[0]);
		beginShape();
		vertex(-r, -r, r);
		vertex(r, -r, r);
		vertex(r, r, r);
		vertex(-r, r, r);
		endShape(CLOSE);

		fill(colors[1]);
		beginShape();
		vertex(-r, -r, -r);
		vertex(r, -r, -r);
		vertex(r, r, -r);
		vertex(-r, r, -r);
		endShape(CLOSE);
		
		fill(colors[2]);
		beginShape();
		vertex(r, -r, -r);
		vertex(r, -r, r);
		vertex(r, r, r);
		vertex(r, r, -r);
		endShape(CLOSE);

		fill(colors[3]);
		beginShape();
		vertex(-r, -r, -r);
		vertex(-r, -r, r);
		vertex(-r, r, r);
		vertex(-r, r, -r);
		endShape(CLOSE);
		
		fill(colors[4]);
		beginShape();
		vertex(-r, -r, -r);
		vertex(-r, -r, r);
		vertex(r, -r, r);
		vertex(r, -r, -r);
		endShape(CLOSE);

		fill(colors[5]);
		beginShape();
		vertex(-r, r, -r);
		vertex(-r, r, r);
		vertex(r, r, r);
		vertex(r, r, -r);
		endShape(CLOSE);
		
		pop();
	}
}
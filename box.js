class Box {
	constructor(posX, posY, posZ, indexX, indexY, indexZ, len) {
		this.pos = createVector(posX, posY, posZ);
		this.index = createVector(indexX, indexY, indexZ);
		this.len = len;
		this.rotation = createVector(0, 0, 0);
	}
	
	turnX(index, angle) {
		if (Math.floor(this.index.x) == index) {
			let temp = createVector(this.pos.y, this.pos.z).rotate(angle);
			this.pos = createVector(this.pos.x, temp.x, temp.y);	// this is confusing -> remember that temp is 2D and pos is 3D
			
			temp = createVector(this.index.y, this.index.z).rotate(angle);
			this.index = createVector(this.index.x, temp.x, temp.y);
			
			this.rotation = createVector(this.rotation.x + angle, this.rotation.y, this.rotation.z);
		}
	}
	
	turnY(index, angle) {
		if (Math.floor(this.index.y) == index) {
			let temp = createVector(this.pos.x, this.pos.z).rotate(angle);
			this.pos = createVector(temp.x, this.pos.y, temp.y);
			
			temp = createVector(this.index.x, this.index.z).rotate(angle);
			this.index = createVector(temp.x, this.index.y, temp.y);
			
			// why is this one minus angle? idk
			this.rotation = createVector(this.rotation.x, this.rotation.y - angle, this.rotation.z);
		}
	}
	
	turnZ(index, angle) {
		if (Math.floor(this.index.z) == index) {
			let temp = createVector(this.pos.x, this.pos.y).rotate(angle);
			this.pos = createVector(temp.x, temp.y, this.pos.z);
			
			temp = createVector(this.index.x, this.index.y, this.index.z).rotate(angle);
			this.index = createVector(temp.x, temp.y, this.index.z);
			
			this.rotation = createVector(this.rotation.x, this.rotation.y, this.rotation.z + angle);
		}
	}
	
	show() {
		stroke(0);
		strokeWeight(2);
		// noStroke();
		push();
		
		translate(this.pos);
		rotateX(this.rotation.x);
		rotateY(this.rotation.y);
		rotateZ(this.rotation.z);
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
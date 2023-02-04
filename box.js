class Box {
	constructor(posX, posY, posZ, indexX, indexY, indexZ, len) {
		this.pos = createVector(posX, posY, posZ);
		this.index = createVector(indexX, indexY, indexZ);
		this.oldIndex = this.index;
		this.len = len;
		this.rotation = createVector(0, 0, 0);
	}
	
	turnX(index) {
		if (this.oldIndex.x == index) {
			let temp = createVector(this.pos.y, this.pos.z).rotate(turnSpeed);
			this.pos = createVector(this.pos.x, temp.x, temp.y);	// this is confusing -> remember that temp is 2D and pos is 3D
			
			temp = createVector(this.index.y, this.index.z).rotate(turnSpeed);
			this.index = createVector(this.index.x, temp.x, temp.y);
			
			this.rotation = createVector(this.rotation.x + turnSpeed, this.rotation.y, this.rotation.z);
		}
	}
	
	turnY(index) {
		if (this.oldIndex.y == index) {
			let temp = createVector(this.pos.x, this.pos.z).rotate(turnSpeed);
			this.pos = createVector(temp.x, this.pos.y, temp.y);
			
			temp = createVector(this.index.x, this.index.z).rotate(turnSpeed);
			this.index = createVector(temp.x, this.index.y, temp.y);
			
			// why is this one minus turnSpeed? idk
			this.rotation = createVector(this.rotation.x, this.rotation.y - turnSpeed, this.rotation.z);
		}
	}
	
	turnZ(index) {
		if (this.oldIndex.z == index) {
			let temp = createVector(this.pos.x, this.pos.y).rotate(turnSpeed);
			this.pos = createVector(temp.x, temp.y, this.pos.z);
			
			temp = createVector(this.index.x, this.index.y).rotate(turnSpeed);
			this.index = createVector(temp.x, temp.y, this.index.z);
			
			this.rotation = createVector(this.rotation.x, this.rotation.y, this.rotation.z + turnSpeed);
		}
	}
	
	update() {
		this.pos = createVector(Math.round(this.pos.x), Math.round(this.pos.y), Math.round(this.pos.z));
		this.index = createVector(Math.round(this.index.x), Math.round(this.index.y), Math.round(this.index.z));
		this.oldIndex = this.index;
		// switch (turn.direction) {
			// case 'x':
				// if (this.oldIndex.x == turn.index)
					// this.rotation = createVector(this.rotation.x, -this.rotation.z, this.rotation.y);
				// break;
			// case 'y':
				// if (this.oldIndex.y == turn.index)
					// this.rotation = createVector(-this.rotation.z, this.rotation.y, this.rotation.x);
				// break;
			// case 'z':
				// if (this.oldIandex.z == turn.index)
					// this.rotation = createVector(-this.rotation.y, this.rotation.x, this.rotation.z);
				// break;
		// }
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
	
	highlight() {
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
		fill(colors[1]);
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
		
		fill(colors[1]);
		beginShape();
		vertex(r, -r, -r);
		vertex(r, -r, r);
		vertex(r, r, r);
		vertex(r, r, -r);
		endShape(CLOSE);

		fill(colors[1]);
		beginShape();
		vertex(-r, -r, -r);
		vertex(-r, -r, r);
		vertex(-r, r, r);
		vertex(-r, r, -r);
		endShape(CLOSE);
		
		fill(colors[1]);
		beginShape();
		vertex(-r, -r, -r);
		vertex(-r, -r, r);
		vertex(r, -r, r);
		vertex(r, -r, -r);
		endShape(CLOSE);

		fill(colors[1]);
		beginShape();
		vertex(-r, r, -r);
		vertex(-r, r, r);
		vertex(r, r, r);
		vertex(r, r, -r);
		endShape(CLOSE);
		
		pop();
	}
}
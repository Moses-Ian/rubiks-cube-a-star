class Box {
	constructor(posX, posY, posZ, indexX, indexY, indexZ, len) {
		this.pos = createVector(posX, posY, posZ);
		this.index = createVector(indexX, indexY, indexZ);
		this.oldIndex = this.index;
		this.len = len;
		this.rotation = createVector(0, 0, 0);
		this.normal = createVector(-1, 0, 0);
		this.start = createVector(1, 0, 0);
	}
	
	turnX(index) {
		if (this.oldIndex.x == index) {
			let temp = createVector(this.pos.y, this.pos.z).rotate(turnSpeed);
			this.pos = createVector(this.pos.x, temp.x, temp.y);	// this is confusing -> remember that temp is 2D and pos is 3D
			
			temp = createVector(this.index.y, this.index.z).rotate(turnSpeed);
			this.index = createVector(this.index.x, temp.x, temp.y);
			
			this.rotation = this.turn(createVector(1, 0, 0));
			
			this.normal = createVector(
				this.normal.x,
				this.normal.y * cos(turnSpeed) - this.normal.z * sin(turnSpeed),
				this.normal.y * sin(turnSpeed) + this.normal.z * cos(turnSpeed)
			);
			
			// this.rotation = createVector(
				// this.rotation.x,
				// this.rotation.y * cos(turnSpeed) - this.rotation.z * sin(turnSpeed),
				// this.rotation.y * sin(turnSpeed) + this.rotation.z * cos(turnSpeed)
			// );
			
			
		}
	}
	
	turnY(index) {
		if (this.oldIndex.y == index) {
			let temp = createVector(this.pos.x, this.pos.z).rotate(turnSpeed);
			this.pos = createVector(temp.x, this.pos.y, temp.y);
			
			temp = createVector(this.index.x, this.index.z).rotate(turnSpeed);
			this.index = createVector(temp.x, this.index.y, temp.y);
			
			this.rotation = this.turn(createVector(0, -1, 0));
			
			this.normal = createVector(
				this.normal.x * cos(turnSpeed) - this.normal.z * sin(turnSpeed),
				this.normal.y,
				this.normal.x * sin(turnSpeed) + this.normal.z * cos(turnSpeed)
			);

			// this.rotation = createVector(
				// this.rotation.x * cos(turnSpeed) - this.rotation.z * sin(turnSpeed),
				// this.rotation.y,
				// this.rotation.x * sin(turnSpeed) + this.rotation.z * cos(turnSpeed)
			// );
		}
	}
	
	turnZ(index) {
		if (this.oldIndex.z == index) {
			let temp = createVector(this.pos.x, this.pos.y).rotate(turnSpeed);
			this.pos = createVector(temp.x, temp.y, this.pos.z);
			
			temp = createVector(this.index.x, this.index.y).rotate(turnSpeed);
			this.index = createVector(temp.x, temp.y, this.index.z);
			
			this.rotation = this.turn(createVector(0, 0, 1));
			
			this.normal = createVector(
				this.normal.x * cos(turnSpeed) - this.normal.y * sin(turnSpeed),
				this.normal.x * sin(turnSpeed) + this.normal.y * cos(turnSpeed),
				this.normal.z
			);
			
			// this.rotation = createVector(
				// this.rotation.x * cos(turnSpeed) - this.rotation.y * sin(turnSpeed),
				// this.rotation.x * sin(turnSpeed) + this.rotation.y * cos(turnSpeed),
				// this.rotation.z
			// );
		}
	}
	
	turn(axis) {
		// return p5.Vector.add(
			// p5.Vector.mult(this.pos, cos(turnSpeed)),
			// p5.Vector.add(
				// p5.Vector.mult(
					// p5.Vector.cross(axis, this.pos),
					// sin(turnSpeed)
				// ),
				// p5.Vector.mult(
					// p5.Vector.mult(
						// axis,
						// p5.Vector.dot(axis, this.pos)
					// ),
					// (1 - cos(turnSpeed))
				// )
			// )
		// );	
		return p5.Vector.mult(axis, turnSpeed).add(this.rotation);
	}
	
	rotateAround(vect, axis, angle) {
		// Make sure our axis is a unit vector
		axis = p5.Vector.normalize(axis);

		return p5.Vector.add(
			p5.Vector.mult(vect, cos(angle)),
			p5.Vector.add(
				p5.Vector.mult(
					p5.Vector.cross(axis, vect),
					sin(angle)
				),
				p5.Vector.mult(
					p5.Vector.mult(
						axis,
						p5.Vector.dot(axis, vect)
					),
					(1 - cos(angle))
				)
			)
		);
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

		// rotateX(this.rotation.x);
		// let newRotation = createVector(
			// this.rotation.x,
			// this.rotation.y * cos(-turnSpeed) - this.rotation.z * sin(-turnSpeed),
			// this.rotation.y * sin(-turnSpeed) + this.rotation.z * cos(-turnSpeed)
		// );
		// rotateZ(-this.rotation.y);
		// rotateY(newRotation.y);

		applyMatrix(this.addAll3(this.rotation));


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
		
		stroke(16);
		line(
			this.pos.x, this.pos.y, this.pos.z, 
			this.pos.x + this.normal.x * this.len,
			this.pos.y + this.normal.y * this.len,
			this.pos.z + this.normal.z * this.len
		);
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

	multAll3(rot) {
		let rotX = [
			[1, 0, 0],
			[0, cos(rot.x), -sin(rot.x)],
			[0, sin(rot.x), cos(rot.x)]
		];
		let rotY = [
			[cos(rot.y), 0, -sin(rot.y)],
			[0, 1, 0],
			[sin(rot.y), 0, cos(rot.y)]
		];
		let rotZ = [
			[cos(rot.z), -sin(rot.z), 0],
			[sin(rot.z), cos(rot.z), 0],
			[0, 0, 1]
		];
		
		let matrix = this.mult(rotX, rotY);
		matrix = this.mult(matrix, rotZ);
		
		let result = [
			matrix[0][0], matrix[0][1], matrix[0][2],
			matrix[1][0], matrix[1][1], matrix[1][2],
			matrix[2][0], matrix[2][1], matrix[2][2],
		];
		
		return result;
		
	}
	
	mult(A, B) {
		let result = new Array(3);
		for(let i=0; i<3; i++) 
			result[i] = new Array(3);
		
		for(let i=0; i<3; i++)
			for(let j=0; j<3; j++)
				result[i][j] = 
					A[i][0] * B[0][j] +
					A[i][1] * B[1][j] +
					A[i][2] * B[2][j];
		
		return result;
	}

	addAll3(rot) {
		let angleX = createVector(1, 0, 0).angleBetween(rot);
		let angleY = createVector(0, 1, 0).angleBetween(rot);
		let angleZ = createVector(0, 0, 1).angleBetween(rot);
		angleX = angleX ? angleX : 0;
		angleY = angleY ? angleY : 0;
		angleZ = angleZ ? angleZ : 0;
		let rotX = [
			[1, 0, 0],
			[0, cos(angleX), -sin(angleX)],
			[0, sin(angleX), cos(angleX)]
		];
		let rotY = [
			[cos(angleY), 0, -sin(angleY)],
			[0, 1, 0],
			[sin(angleY), 0, cos(angleY)]
		];
		let rotZ = [
			[cos(angleZ), -sin(angleZ), 0],
			[sin(angleZ), cos(angleZ), 0],
			[0, 0, 1]
		];
		
		let matrix = this.add(rotX, rotY);
		matrix = this.add(matrix, rotZ);
		
		let result = [
			matrix[0][0], matrix[0][1], matrix[0][2],
			matrix[1][0], matrix[1][1], matrix[1][2],
			matrix[2][0], matrix[2][1], matrix[2][2],
		];
		
		return result;
		
	}
	
	add(A, B) {
		let result = new Array(3);
		for(let i=0; i<3; i++) 
			result[i] = new Array(3);
		
		for(let i=0; i<3; i++)
			for(let j=0; j<3; j++)
				result[i][j] = A[i][j] + B[i][j];
		
		return result;
	}





}
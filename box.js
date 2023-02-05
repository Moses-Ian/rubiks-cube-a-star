import * as THREE from 'three';

const colors = [
	new THREE.Color('white'), new THREE.Color('yellow'),
	new THREE.Color('orange'), new THREE.Color('red'),
	new THREE.Color('green'), new THREE.Color('blue')
];

const PI = Math.PI;
const HALF_PI = Math.PI / 2;
	
class Box {
	
	constructor(posX, posY, posZ, indexX, indexY, indexZ, len) {
		this.pos = new THREE.Vector3(posX, posY, posZ);
		this.index = new THREE.Vector3(indexX, indexY, indexZ);
		this.oldIndex = this.index;
		this.len = len;
		this.rotation = new THREE.Vector3(0, 0, 0);
		this.normal = new THREE.Vector3(-1, 0, 0);
		this.start = new THREE.Vector3(1, 0, 0);
		
		this.planes = new Array(6);
		this.outlines = new Array(6);
	
		// make the planes
		let geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.rotateY(HALF_PI);
		geometry.translate(this.len/2, 0, 0);
		let material = new THREE.MeshBasicMaterial( {color: colors[0], side: THREE.DoubleSide} );
		this.planes[0] = new THREE.Mesh( geometry, material );
		let geo = new THREE.EdgesGeometry( geometry );
		let mat = new THREE.LineBasicMaterial( { color: 0x000000 } );
		this.outlines[0] = new THREE.LineSegments( geo, mat );
		
		geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.rotateY(HALF_PI);
		geometry.translate(-this.len/2, 0, 0);
		material = new THREE.MeshBasicMaterial( {color: colors[1], side: THREE.DoubleSide} );
		this.planes[1] = new THREE.Mesh( geometry, material );
		geo = new THREE.EdgesGeometry( geometry );
		this.outlines[1] = new THREE.LineSegments( geo, mat );

		geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.rotateX(HALF_PI);
		geometry.translate(0, this.len/2, 0);
		material = new THREE.MeshBasicMaterial( {color: colors[2], side: THREE.DoubleSide} );
		this.planes[2] = new THREE.Mesh( geometry, material );
		geo = new THREE.EdgesGeometry( geometry );
		this.outlines[2] = new THREE.LineSegments( geo, mat );
		
		geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.rotateX(HALF_PI);
		geometry.translate(0, -this.len/2, 0);
		material = new THREE.MeshBasicMaterial( {color: colors[3], side: THREE.DoubleSide} );
		this.planes[3] = new THREE.Mesh( geometry, material );
		geo = new THREE.EdgesGeometry( geometry );
		this.outlines[3] = new THREE.LineSegments( geo, mat );
		
		geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.translate(0, 0, this.len/2);
		material = new THREE.MeshBasicMaterial( {color: colors[4], side: THREE.DoubleSide} );
		this.planes[4] = new THREE.Mesh( geometry, material );
		geo = new THREE.EdgesGeometry( geometry );
		this.outlines[4] = new THREE.LineSegments( geo, mat );
		
		geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.translate(0, 0, -this.len/2);
		material = new THREE.MeshBasicMaterial( {color: colors[5], side: THREE.DoubleSide} );
		this.planes[5] = new THREE.Mesh( geometry, material );
		geo = new THREE.EdgesGeometry( geometry );
		this.outlines[5] = new THREE.LineSegments( geo, mat );
		
		this.group = new THREE.Group();
		this.planes.forEach(plane => this.group.add(plane));
		this.outlines.forEach(outline => this.group.add(outline));
		
		this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
		
	}
	
	turnX(index) {
		if (this.oldIndex.x == index) {
			let temp = new THREE.Vector3(this.pos.y, this.pos.z).rotate(turnSpeed);
			this.pos = new THREE.Vector3(this.pos.x, temp.x, temp.y);	// this is confusing -> remember that temp is 2D and pos is 3D
			
			temp = new THREE.Vector3(this.index.y, this.index.z).rotate(turnSpeed);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.rotation = this.turn(new THREE.Vector3(1, 0, 0));
			
			this.normal = new THREE.Vector3(
				this.normal.x,
				this.normal.y * cos(turnSpeed) - this.normal.z * sin(turnSpeed),
				this.normal.y * sin(turnSpeed) + this.normal.z * cos(turnSpeed)
			);
			
			// this.rotation = new THREE.Vector3(
				// this.rotation.x,
				// this.rotation.y * cos(turnSpeed) - this.rotation.z * sin(turnSpeed),
				// this.rotation.y * sin(turnSpeed) + this.rotation.z * cos(turnSpeed)
			// );
			
			
		}
	}
	
	turnY(index) {
		if (this.oldIndex.y == index) {
			let temp = new THREE.Vector3(this.pos.x, this.pos.z).rotate(turnSpeed);
			this.pos = new THREE.Vector3(temp.x, this.pos.y, temp.y);
			
			temp = new THREE.Vector3(this.index.x, this.index.z).rotate(turnSpeed);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.rotation = this.turn(new THREE.Vector3(0, -1, 0));
			
			this.normal = new THREE.Vector3(
				this.normal.x * cos(turnSpeed) - this.normal.z * sin(turnSpeed),
				this.normal.y,
				this.normal.x * sin(turnSpeed) + this.normal.z * cos(turnSpeed)
			);

			// this.rotation = new THREE.Vector3(
				// this.rotation.x * cos(turnSpeed) - this.rotation.z * sin(turnSpeed),
				// this.rotation.y,
				// this.rotation.x * sin(turnSpeed) + this.rotation.z * cos(turnSpeed)
			// );
		}
	}
	
	turnZ(index) {
		if (this.oldIndex.z == index) {
			let temp = new THREE.Vector3(this.pos.x, this.pos.y).rotate(turnSpeed);
			this.pos = new THREE.Vector3(temp.x, temp.y, this.pos.z);
			
			temp = new THREE.Vector3(this.index.x, this.index.y).rotate(turnSpeed);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.rotation = this.turn(new THREE.Vector3(0, 0, 1));
			
			this.normal = new THREE.Vector3(
				this.normal.x * cos(turnSpeed) - this.normal.y * sin(turnSpeed),
				this.normal.x * sin(turnSpeed) + this.normal.y * cos(turnSpeed),
				this.normal.z
			);
			
			// this.rotation = new THREE.Vector3(
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
		this.pos = new THREE.Vector3(Math.round(this.pos.x), Math.round(this.pos.y), Math.round(this.pos.z));
		this.index = new THREE.Vector3(Math.round(this.index.x), Math.round(this.index.y), Math.round(this.index.z));
		this.oldIndex = this.index;
		// switch (turn.direction) {
			// case 'x':
				// if (this.oldIndex.x == turn.index)
					// this.rotation = new THREE.Vector3(this.rotation.x, -this.rotation.z, this.rotation.y);
				// break;
			// case 'y':
				// if (this.oldIndex.y == turn.index)
					// this.rotation = new THREE.Vector3(-this.rotation.z, this.rotation.y, this.rotation.x);
				// break;
			// case 'z':
				// if (this.oldIandex.z == turn.index)
					// this.rotation = new THREE.Vector3(-this.rotation.y, this.rotation.x, this.rotation.z);
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
		// let newRotation = new THREE.Vector3(
			// this.rotation.x,
			// this.rotation.y * cos(-turnSpeed) - this.rotation.z * sin(-turnSpeed),
			// this.rotation.y * sin(-turnSpeed) + this.rotation.z * cos(-turnSpeed)
		// );
		// rotateZ(-this.rotation.y);
		// rotateY(newRotation.y);

		// applyMatrix(this.addAll3(this.rotation));
		// rotateX(this.rotation.x);
		// rotateY(this.rotation.y);
		// rotateZ(this.rotation.z);
		// if (this.rotation.mag() != 0)
			rotateY(new THREE.Vector3(this.normal.x, 0, this.normal.z).angleBetween(this.start));


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

	addToScene(scene) {
		scene.add(this.group);
	}
}

export { Box };
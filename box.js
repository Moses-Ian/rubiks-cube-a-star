/*
Note to myself in the future because I WILL forget how static functions work:

I might eventually try to display a lot of these on screen at once, and it is between 14% - 61% as memory intensive to use static functions.

To use static functions, you can just say myBox.myFunction().
You have to say Box.myFunction.call().

In rubik.js, I do something slightly crazier.
Remember that Box[myFunction] is equivalent to Box.myfunction, except that now you can use a variable, e.g.
let myMysteriousFunction = 'myFunction';
Box[myMysteriousFunction].call();

With this setup, I can display 100 cubes and have them rotate only slightly faster than with instance methods.

*/




import * as THREE from 'three';
import { turnSpeed } from './turn.js';

const DRAW_NORMAL = true;

const colors = [
	new THREE.Color('white'), new THREE.Color('yellow'),
	new THREE.Color('orange'), new THREE.Color('red'),
	new THREE.Color('green'), new THREE.Color('blue')
];

const PI = Math.PI;
const HALF_PI = Math.PI / 2;

const ZERO2D = new THREE.Vector2(0, 0);
const X3D = new THREE.Vector3(1, 0, 0);
const Y3D = new THREE.Vector3(0, -1, 0);
const Z3D = new THREE.Vector3(0, 0, 1);
	
class Box {
	
	constructor(posX, posY, posZ, indexX, indexY, indexZ, len) {
		this.index = new THREE.Vector3(indexX, indexY, indexZ);
		this.oldIndex = this.index;
		this.len = len;
		this.pos = this.index.clone().multiplyScalar(this.len);
		this.rotation = new THREE.Vector3(0, 0, 0);
		// the normal is easy to keep track of and predict
		this.normal = new THREE.Vector3(1, 0, 0).multiplyScalar(this.len);
		
		this.planes = new Array(6);
		this.outlines = new Array(6);
	
		// make the planes
		let mat = new THREE.LineBasicMaterial( { color: 0x000000 } );

		let geometry = new THREE.PlaneGeometry( this.len, this.len );
		geometry.rotateY(HALF_PI);
		geometry.translate(this.len/2, 0, 0);
		let material = new THREE.MeshBasicMaterial( {color: colors[0], side: THREE.DoubleSide} );
		this.planes[0] = new THREE.Mesh( geometry, material );
		let geo = new THREE.EdgesGeometry( geometry );
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
		
		// make the normal
		// this is separate from the group so that we can check our math
		this.line = null;
		if (DRAW_NORMAL) {
			const normalMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
			const points = [];
			points.push( this.pos.clone() );
			points.push( this.normal.clone().add(this.pos) );
			const normalGeometry = new THREE.BufferGeometry().setFromPoints( points );
			this.line = new THREE.Line( normalGeometry, normalMaterial );
			// console.log(this.line);
		}
		
	}
	
	static turnX(index) {
		if (this.oldIndex.x == index) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.updatePos();
			
			this.turn(X3D);

			this.normal.x = this.normal.x;
			this.normal.y = this.normal.y * Math.cos(turnSpeed) - this.normal.z * Math.sin(turnSpeed);
			this.normal.z = this.normal.y * Math.sin(turnSpeed) + this.normal.z * Math.cos(turnSpeed);
			this.updateNormal();
		}	
			
	}
	
	static turnY(index) {
		if (this.oldIndex.y == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.updatePos();
			
			this.turn(Y3D);

			this.normal.x = this.normal.x * Math.cos(turnSpeed) - this.normal.z * Math.sin(turnSpeed);
			this.normal.y = this.normal.y;
			this.normal.z = this.normal.x * Math.sin(turnSpeed) + this.normal.z * Math.cos(turnSpeed);
			this.updateNormal();
		}
	}
	
	static turnZ(index) {
		if (this.oldIndex.z == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.updatePos();
			
			this.turn(Z3D);

			this.normal.x = this.normal.x * Math.cos(turnSpeed) - this.normal.y * Math.sin(turnSpeed);
			this.normal.y = this.normal.x * Math.sin(turnSpeed) + this.normal.y * Math.cos(turnSpeed);
			this.normal.z = this.normal.z;
			this.updateNormal();
		}
	}
	
	static turnNegX(index) {
		if (this.oldIndex.x == index) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, -turnSpeed);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.updatePos();
			
			this.turn(X3D, -turnSpeed);

			this.normal.x = this.normal.x;
			this.normal.y = this.normal.y * Math.cos(-turnSpeed) - this.normal.z * Math.sin(-turnSpeed);
			this.normal.z = this.normal.y * Math.sin(-turnSpeed) + this.normal.z * Math.cos(-turnSpeed);
			this.updateNormal();
		}	
			
	}
	
	static turnNegY(index) {
		if (this.oldIndex.y == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, -turnSpeed);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.updatePos();
			
			this.turn(Y3D, -turnSpeed);

			this.normal.x = this.normal.x * Math.cos(-turnSpeed) - this.normal.z * Math.sin(-turnSpeed);
			this.normal.y = this.normal.y;
			this.normal.z = this.normal.x * Math.sin(-turnSpeed) + this.normal.z * Math.cos(-turnSpeed);
			this.updateNormal();
		}
	}
	
	static turnNegZ(index) {
		if (this.oldIndex.z == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, -turnSpeed);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.updatePos();
			
			this.turn(Z3D, -turnSpeed);

			this.normal.x = this.normal.x * Math.cos(-turnSpeed) - this.normal.y * Math.sin(-turnSpeed);
			this.normal.y = this.normal.x * Math.sin(-turnSpeed) + this.normal.y * Math.cos(-turnSpeed);
			this.normal.z = this.normal.z;
			this.updateNormal();
		}
	}
	
	turn(axis, angle = turnSpeed) {
		this.group.rotateOnWorldAxis(axis, angle);
	}
	
	updateNormal() {
		if (!DRAW_NORMAL)
			return;
		let arr = this.line.geometry.attributes.position.array;
		arr[0] = this.pos.x;
		arr[1] = this.pos.y;
		arr[2] = this.pos.z;
		arr[3] = this.normal.x;
		arr[4] = this.normal.y;
		arr[5] = this.normal.z;
		this.line.geometry.attributes.position.needsUpdate = true;
	}
	
	updatePos() {
		this.pos = this.index.clone().multiplyScalar(this.len);
		this.group.position.x = this.pos.x;
		this.group.position.y = this.pos.y;
		this.group.position.z = this.pos.z;
	}
	
	static update() {
		this.group.position.round();
		this.pos = this.group.position;
		this.index.round();
		this.oldIndex = this.index;
		this.rotation = new THREE.Vector3(this.group.rotation.x, this.group.rotation.y, this.group.rotation.z);
		this.roundNormal();
	}
	
	addToScene(scene) {
		scene.add(this.group);
		if (DRAW_NORMAL)
			scene.add(this.line);
	}
	
	roundNormal() {
		this.normal.round();
		let x = this.normal.x % 10;
		if (x == 9 || x == -1)
			this.normal.x++;
		if (x == 1 || x == -9)
			this.normal.x--;
		let y = this.normal.y % 10;
		if (y == 9 || y == -1)
			this.normal.y++;
		if (y == 1 || y == -9)
			this.normal.y--;
		let z = this.normal.z % 10;
		if (z == 9 || z == -1)
			this.normal.z++;
		if (z == 1 || z == -9)
			this.normal.z--;
		this.updateNormal();
	}
}

export { Box };
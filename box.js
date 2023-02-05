import * as THREE from 'three';
import { turnSpeed } from './turn.js';

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
		this.pos = new THREE.Vector3(posX, posY, posZ);
		this.index = new THREE.Vector3(indexX, indexY, indexZ);
		this.oldIndex = this.index;
		this.len = len;
		this.rotation = new THREE.Vector3(0, 0, 0);
		
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
		
	}
	
	turnX(index) {
		if (this.oldIndex.x == index) {
			let temp = new THREE.Vector2(this.pos.y, this.pos.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.pos = new THREE.Vector3(this.pos.x, temp.x, temp.y);	// this is confusing -> remember that temp is 2D and pos is 3D
			this.group.position.x = this.pos.x;
			this.group.position.y = this.pos.y;
			this.group.position.z = this.pos.z;
			
			temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.turn(X3D);
		}	
			
	}
	
	turnY(index) {
		if (this.oldIndex.y == index) {
			let temp = new THREE.Vector2(this.pos.x, this.pos.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.pos = new THREE.Vector3(temp.x, this.pos.y, temp.y);
			this.group.position.x = this.pos.x;
			this.group.position.y = this.pos.y;
			this.group.position.z = this.pos.z;
			
			temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.turn(Y3D);
		}
	}
	
	turnZ(index) {
		if (this.oldIndex.z == index) {
			let temp = new THREE.Vector2(this.pos.x, this.pos.y)
				.rotateAround(ZERO2D, turnSpeed);
			this.pos = new THREE.Vector3(temp.x, temp.y, this.pos.z);
			this.group.position.x = this.pos.x;
			this.group.position.y = this.pos.y;
			this.group.position.z = this.pos.z;
			
			temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, turnSpeed);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.turn(Z3D);
		}
	}
	
	turn(axis) {
		this.group.rotateOnWorldAxis(axis, turnSpeed);
	}
	
	update() {
		this.group.position.round();
		this.pos = this.group.position;
		this.index.round();
		this.oldIndex = this.index;
		this.rotation = new THREE.Vector3(this.group.rotation.x, this.group.rotation.y, this.group.rotation.z);
	}
	
	addToScene(scene) {
		scene.add(this.group);
	}
}

export { Box };
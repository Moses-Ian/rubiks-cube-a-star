import * as THREE from 'three';

const HALF_PI = Math.PI/2;
const ZERO2D = new THREE.Vector2(0, 0);


class Cubie {
	constructor(indexX, indexY, indexZ, normalX, normalY, normalZ) {
		this.index = new THREE.Vector3(indexX, indexY, indexZ);
		this.normal = new THREE.Vector3(normalX, normalY, normalZ);
	}
	
	equals(other, log = false) {
		if (log) {
			console.log('----------')
			console.log(this.index, other.index);
			console.log(this.normal, other.normal);
		}
		if (this.index.x != other.index.x) return false;
		if (this.index.y != other.index.y) return false;
		if (this.index.z != other.index.z) return false;
		if (this.normal.x != other.normal.x) return false;
		if (this.normal.y != other.normal.y) return false;
		if (this.normal.z != other.normal.z) return false;
		return true;
	}

	static turnX(index) {
		if (this.index.x == index) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.normal.x = this.normal.x;
			this.normal.y = this.normal.y * Math.cos(HALF_PI) - this.normal.z * Math.sin(HALF_PI);
			this.normal.z = this.normal.y * Math.sin(HALF_PI) + this.normal.z * Math.cos(HALF_PI);
			
			Cubie.update.call(this);
		}	
	}
	
	static turnY(index) {
		if (this.index.y == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.normal.x = this.normal.x * Math.cos(HALF_PI) - this.normal.z * Math.sin(HALF_PI);
			this.normal.y = this.normal.y;
			this.normal.z = this.normal.x * Math.sin(HALF_PI) + this.normal.z * Math.cos(HALF_PI);
			
			Cubie.update.call(this);
		}
	}
	
	static turnZ(index) {
		if (this.index.z == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.normal.x = this.normal.x * Math.cos(HALF_PI) - this.normal.y * Math.sin(HALF_PI);
			this.normal.y = this.normal.x * Math.sin(HALF_PI) + this.normal.y * Math.cos(HALF_PI);
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static turnNegX(index) {
		if (this.index.x == index) {
			let temp = new THREE.Vector2(this.index.y, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(this.index.x, temp.x, temp.y);
			
			this.normal.x = this.normal.x;
			this.normal.y = this.normal.y * Math.cos(-HALF_PI) - this.normal.z * Math.sin(-HALF_PI);
			this.normal.z = this.normal.y * Math.sin(-HALF_PI) + this.normal.z * Math.cos(-HALF_PI);
			
			Cubie.update.call(this);
		}	
			
	}
	
	static turnNegY(index) {
		if (this.index.y == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.z)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, this.index.y, temp.y);
			
			this.normal.x = this.normal.x * Math.cos(-HALF_PI) - this.normal.z * Math.sin(-HALF_PI);
			this.normal.y = this.normal.y;
			this.normal.z = this.normal.x * Math.sin(-HALF_PI) + this.normal.z * Math.cos(-HALF_PI);
			
			Cubie.update.call(this);
		}
	}
	
	static turnNegZ(index) {
		if (this.index.z == index) {
			let temp = new THREE.Vector2(this.index.x, this.index.y)
				.rotateAround(ZERO2D, -HALF_PI);
			this.index = new THREE.Vector3(temp.x, temp.y, this.index.z);
			
			this.normal.x = this.normal.x * Math.cos(-HALF_PI) - this.normal.y * Math.sin(-HALF_PI);
			this.normal.y = this.normal.x * Math.sin(-HALF_PI) + this.normal.y * Math.cos(-HALF_PI);
			this.normal.z = this.normal.z;
			
			Cubie.update.call(this);
		}
	}
	
	static update() {
		this.index.round();
		this.normal.round();
	}
	
}

export {Cubie};